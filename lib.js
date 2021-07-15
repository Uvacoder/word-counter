export function getTheme() {
    if (typeof Storage !== "undefined") {
        // can use window.localStorage, so use the set value if it exists
        if (getPreferredTheme() === "dark") return "dark"
    }
    return "light"
}

export function savePreferredTheme(theme) {
    if (typeof Storage !== "undefined") {
        localStorage.setItem("preferredTheme", theme)
    }
}

export function getPreferredTheme() {
    if (typeof Storage !== "undefined") {
        // can use window.localStorage, so use the set value if it exists
        if (localStorage.getItem("preferredTheme") === "dark") return "dark"
    }
    return "light"
}

export function saveStats(stats) {
    if (typeof Storage !== "undefined") {
        localStorage.setItem("stats", JSON.stringify(stats))
    }
}

export function getTextFromStorage() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("text")
    } else {
        return ""
    }
}

export function getStatsFromStorage() {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("stats"))
    } else {
        return ""
    }
}

export function saveText(text) {
    if (typeof Storage !== "undefined") {
        localStorage.setItem("text", text)
    }
}
