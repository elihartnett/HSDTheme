import SwiftUI

struct SDThemer {
    static var theme: SDTheme = SDThemes.default.sdTheme
}

protocol SDTheme {
    var strings: any SDStrings { get }
    var dimensions: any SDDimensions { get }
    var colors: any SDColors { get }
    var fonts: any SDFonts { get }
}

protocol SDStrings {
    var label: String { get }
}

protocol SDDimensions {
    var width: CGFloat { get }
    var height: CGFloat { get }
}

protocol SDColors {
    var primary: Color { get }
    var secondary: Color { get }
}

protocol SDFonts {
    var body: Font { get }
}

enum SDThemes: CaseIterable {
    case custom
    case `default`

    var sdTheme: SDTheme {
        switch self {
        case .custom: return CustomSDTheme()
        case .`default`: return DefaultSDTheme()
        }
    }
}

private extension UIColor {
    convenience init(hex: String) {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hexString.hasPrefix("#") { hexString.removeFirst() }
        var rgbValue: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&rgbValue)
        self.init(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: 1.0
        )
    }
}

struct CustomSDTheme: SDTheme {

    var strings: any SDStrings = Strings()
    var dimensions: any SDDimensions = Dimensions()
    var colors: any SDColors = Colors()
    var fonts: any SDFonts = Fonts()

    struct Strings: SDStrings {
        var label: String { return "" }
    }

    struct Dimensions: SDDimensions {
        var width: CGFloat { 0 }
        var height: CGFloat { 0 }
    }

    struct Colors: SDColors {
        var primary: Color {
            return Color(UIColor { traitCollection in
                switch traitCollection.userInterfaceStyle {
                case .dark:
                    return UIColor(hex: "#FFFFFF")
                default:
                    return UIColor(hex: "#000000")
                }
            })
        }
        var secondary: Color { return Color(UIColor(hex: "#808080")) }
    }

    struct Fonts: SDFonts {
        var body: Font { .custom("", size: 0) }
    }
}

struct DefaultSDTheme: SDTheme {

    var strings: any SDStrings = Strings()
    var dimensions: any SDDimensions = Dimensions()
    var colors: any SDColors = Colors()
    var fonts: any SDFonts = Fonts()

    struct Strings: SDStrings {
        var label: String { return "" }
    }

    struct Dimensions: SDDimensions {
        var width: CGFloat { 0 }
        var height: CGFloat { 0 }
    }

    struct Colors: SDColors {
        var primary: Color {
            return Color(UIColor { traitCollection in
                switch traitCollection.userInterfaceStyle {
                case .dark:
                    return UIColor(hex: "#FFFFFF")
                default:
                    return UIColor(hex: "#000000")
                }
            })
        }
        var secondary: Color { return Color(UIColor(hex: "#808080")) }
    }

    struct Fonts: SDFonts {
        var body: Font { .custom("", size: 0) }
    }
}