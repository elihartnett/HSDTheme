package com.example.theme
import com.example.theme.R

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import android.graphics.Color as AndroidColor

object SDThemer {
    var theme: SDTheme = SDThemes.DEFAULT.sdTheme()
}

interface SDTheme {
    val strings: SDStrings
    val dimensions: SDDimensions
    val bools: SDBools
    val colors: SDColors
    val fonts: SDFonts
}
  
interface SDStrings {
    val label: String
}
  
interface SDDimensions {
    val width: Float
    val height: Float
}
  
interface SDBools {
    val show: Boolean
}
  
interface SDColors {
    @Composable
    fun primary(): Color
    val secondary: Color
}
  
interface SDFonts {
      val body: TextStyle
}

enum class SDThemes {
    CUSTOM,
    DEFAULT;

    fun sdTheme(): SDTheme {
        return when (this) {
            CUSTOM -> CustomSDTheme
            DEFAULT -> DefaultSDTheme
        }
    }
}

object CustomSDTheme : SDTheme {

    override val strings: SDStrings = Strings
    override val dimensions: SDDimensions = Dimensions
    override val bools: SDBools = Bools
    override val colors: SDColors = Colors
    override val fonts: SDFonts = Fonts

    object Strings : SDStrings {
        override val label: String get() = ""
    }

    object Dimensions : SDDimensions {
        override val width: Float get() = 0f
        override val height: Float get() = 0f
    }

    object Bools : SDBools {
        override val show: Boolean get() = false
    }

    object Colors : SDColors {
        @Composable
        override fun primary(): Color {
            return if (isSystemInDarkTheme()) {
                Color(AndroidColor.parseColor("#FFFFFF"))
            } else {
                Color(AndroidColor.parseColor("#000000"))
            }
        }
        override val secondary: Color = Color(AndroidColor.parseColor("#808080"))
    }

    object Fonts : SDFonts {
        override val body: TextStyle get() = TextStyle(
            fontFamily = FontFamily(Font(R.font.Arial)),
            fontSize = 0.sp
        )
    }
}


object DefaultSDTheme : SDTheme {

    override val strings: SDStrings = Strings
    override val dimensions: SDDimensions = Dimensions
    override val bools: SDBools = Bools
    override val colors: SDColors = Colors
    override val fonts: SDFonts = Fonts

    object Strings : SDStrings {
        override val label: String get() = ""
    }

    object Dimensions : SDDimensions {
        override val width: Float get() = 0f
        override val height: Float get() = 0f
    }

    object Bools : SDBools {
        override val show: Boolean get() = false
    }

    object Colors : SDColors {
        @Composable
        override fun primary(): Color {
            return if (isSystemInDarkTheme()) {
                Color(AndroidColor.parseColor("#FFFFFF"))
            } else {
                Color(AndroidColor.parseColor("#000000"))
            }
        }
        override val secondary: Color = Color(AndroidColor.parseColor("#808080"))
    }

    object Fonts : SDFonts {
        override val body: TextStyle get() = TextStyle(
            fontFamily = FontFamily(Font(R.font.Arial)),
            fontSize = 0.sp
        )
    }
}
