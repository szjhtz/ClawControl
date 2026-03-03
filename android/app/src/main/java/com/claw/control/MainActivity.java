package com.claw.control;

import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(ConnectionServicePlugin.class);
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
        setupInsetsHandling();
    }

    /**
     * Handles safe area insets and keyboard resizing from the native side.
     *
     * On Android with edge-to-edge (enforced on API 35+), the WebView draws
     * behind system bars but CSS env(safe-area-inset-*) returns 0.
     * Capacitor's SystemBars plugin only handles this on API 35+.
     *
     * This listener:
     * 1. Injects --safe-area-inset-top/bottom as CSS custom properties
     * 2. Resizes the WebView via bottom margin when the keyboard appears,
     *    making 100dvh automatically adapt (no JS keyboard handler needed)
     */
    private void setupInsetsHandling() {
        if (getBridge() == null || getBridge().getWebView() == null) return;

        View webViewContainer = (View) getBridge().getWebView().getParent();

        ViewCompat.setOnApplyWindowInsetsListener(webViewContainer, (view, windowInsets) -> {
            Insets navBars = windowInsets.getInsets(WindowInsetsCompat.Type.navigationBars());
            Insets statusBars = windowInsets.getInsets(WindowInsetsCompat.Type.statusBars());
            Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
            boolean imeVisible = windowInsets.isVisible(WindowInsetsCompat.Type.ime());

            // CSS px in a WebView correspond to device-independent pixels (the
            // WebView already accounts for density), so divide native px by density.
            float density = getResources().getDisplayMetrics().density;
            int navBottomCss = Math.round(navBars.bottom / density);
            int statusTopCss = Math.round(statusBars.top / density);

            // Inject safe area insets as CSS custom properties.
            // When keyboard is visible, bottom = 0 (keyboard covers the nav bar).
            String js = String.format(
                "document.documentElement.style.setProperty('--safe-area-inset-top','%dpx');" +
                "document.documentElement.style.setProperty('--safe-area-inset-bottom','%dpx');",
                statusTopCss,
                imeVisible ? 0 : navBottomCss
            );
            getBridge().getWebView().evaluateJavascript(js, null);

            // Resize the WebView container when the keyboard is showing.
            // Setting bottom margin shrinks the container, which makes 100dvh
            // automatically adapt — no JS-side keyboard handling needed.
            ViewGroup.MarginLayoutParams params =
                (ViewGroup.MarginLayoutParams) view.getLayoutParams();
            params.bottomMargin = imeVisible ? ime.bottom : 0;
            view.setLayoutParams(params);

            // Consume insets so the WebView doesn't also try to handle them
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
