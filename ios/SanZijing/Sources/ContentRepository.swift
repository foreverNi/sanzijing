import Foundation

enum ContentRepository {
    static let pages: [ClassicPage] = {
        guard let url = Bundle.main.url(forResource: "ContentData", withExtension: "json") else {
            AppLogger.error("ContentData.json is missing from bundle")
            return []
        }
        do {
            let data = try Data(contentsOf: url)
            let pages = try JSONDecoder().decode([ClassicPage].self, from: data)
            AppLogger.info("Loaded \(pages.count) pages")
            return pages
        } catch {
            AppLogger.error("Failed to decode content: \(error.localizedDescription)")
            return []
        }
    }()
}
