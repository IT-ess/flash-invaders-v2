package com.flashinvader.zwietess

import android.content.Intent
import android.net.Uri
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.os.Build
import android.os.Bundle
import android.os.Parcelable
import androidx.activity.enableEdgeToEdge
import app.tauri.deep_link.DeepLinkPlugin

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    // A cold launch from an NFC tag arrives as an NFC intent (NDEF/TECH/TAG),
    // which the deep-link plugin ignores. Rewrite it to a VIEW intent *before*
    // the plugins load so `DeepLinkPlugin.load()` picks it up as a deeplink.
    // The NFC plugin doesn't read the launch intent, so this is safe for it.
    rewriteNfcIntentToView(intent)
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
  }

  override fun onNewIntent(intent: Intent) {
    // Let the NFC plugin process it first (it handles in-app foreground scans),
    // then forward a synthetic VIEW intent to the deep-link plugin so a tag
    // scanned while the app is open/backgrounded also opens the success modal.
    // We don't mutate the original intent here so in-app scanning is untouched;
    // the JS side ignores this event while its own NFC scan is running.
    super.onNewIntent(intent)
    val url = extractInvaderUrl(intent) ?: return
    val viewIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
    DeepLinkPlugin.instance?.onNewIntent(viewIntent)
  }

  // Turn an NFC launch intent into a VIEW intent in place (used for cold start).
  private fun rewriteNfcIntentToView(intent: Intent?) {
    intent ?: return
    val url = extractInvaderUrl(intent) ?: return
    intent.action = Intent.ACTION_VIEW
    intent.data = Uri.parse(url)
  }

  // Extract a `zwietess://invader…` URL from an NFC intent, or null if none.
  private fun extractInvaderUrl(intent: Intent): String? {
    val action = intent.action
    val isNfc =
      action == NfcAdapter.ACTION_NDEF_DISCOVERED ||
        action == NfcAdapter.ACTION_TECH_DISCOVERED ||
        action == NfcAdapter.ACTION_TAG_DISCOVERED
    if (!isNfc) return null

    // NDEF_DISCOVERED with a URI record sets the intent data directly.
    intent.dataString?.let { if (it.startsWith("zwietess://")) return it }

    // Otherwise inspect the raw NDEF message records (URI or text).
    val messages =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES, Parcelable::class.java)
      } else {
        @Suppress("DEPRECATION") intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES)
      } ?: return null

    for (raw in messages) {
      val message = raw as? NdefMessage ?: continue
      for (record in message.records) {
        recordToInvaderUrl(record)?.let { return it }
      }
    }
    return null
  }

  private fun recordToInvaderUrl(record: NdefRecord): String? {
    // URI record.
    try {
      val uri = record.toUri()
      if (uri != null && uri.scheme == "zwietess") return uri.toString()
    } catch (_: Exception) {}

    // Well-known text record: [status byte][lang code][UTF-8 text].
    if (record.tnf == NdefRecord.TNF_WELL_KNOWN && record.type.contentEquals(NdefRecord.RTD_TEXT)) {
      val payload = record.payload
      if (payload.isNotEmpty()) {
        val langLength = payload[0].toInt() and 0x3f
        val text = String(payload, 1 + langLength, payload.size - 1 - langLength, Charsets.UTF_8)
        if (text.startsWith("zwietess://")) return text
      }
    }
    return null
  }
}
