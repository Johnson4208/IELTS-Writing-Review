/*
 * Thư viện nội dung tĩnh. Mỗi bài được đóng gói dưới dạng một object REVIEW.
 * Thêm bài mới vào mảng REVIEWS; xem README.md để biết cấu trúc từng trường.
 */
window.REVIEWS = [
  {
    id: "printed-books-online",
    title: "Báo in và sách giấy sẽ biến mất?",
    prompt: "In the future, nobody will buy printed newspapers or books because they will be able to read everything they want online for free. To what extent do you agree or disagree?",
    type: "task2",
    typeLabel: "WRITING TASK 2",
    topic: "Technology · Media",
    date: "05 THÁNG 11, 2026",
    band: 6.5,
    wordCount: 289,
    duration: "40 phút",
    verdict: "Quan điểm rõ và có hướng triển khai phù hợp. Bài cần cải thiện độ chính xác ngữ pháp, cách diễn đạt tự nhiên và chiều sâu của ví dụ để thuyết phục hơn.",
    scores: [
      { name: "Task Response", short: "TR", score: 7.0, color: "violet", note: "Trả lời đúng trọng tâm, nêu quan điểm rõ. Một số luận điểm cần được giải thích và minh họa cụ thể hơn." },
      { name: "Coherence & Cohesion", short: "CC", score: 7.0, color: "green", note: "Bố cục dễ theo dõi. Cần tránh một vài liên kết máy móc và làm rõ quan hệ giữa ví dụ với luận điểm." },
      { name: "Lexical Resource", short: "LR", score: 6.0, color: "orange", note: "Có vốn từ theo chủ đề nhưng một số kết hợp từ chưa tự nhiên và lặp từ khóa." },
      { name: "Grammar Range & Accuracy", short: "GRA", score: 6.0, color: "blue", note: "Có sử dụng câu phức. Cần sửa cấu trúc động từ, mạo từ và một số câu diễn đạt chưa chuẩn." }
    ],
    paragraphs: [
      {
        label: "MỞ BÀI",
        original: "In recent decades, technological development has transformed the way how people work, communicate, and live. Some people believe that technology advances going to make traditional skills and lifestyles inevitably disappear in the near future. I disagree with this view because traditional practices are an important part of cultural identity and can still provide valuable benefits in modern society.",
        summary: "Quan điểm được nêu trực tiếp và đúng hướng, nhưng hai cấu trúc ở đầu đoạn làm giảm độ chính xác. Cụm “traditional skills and lifestyles” cũng rộng hơn đề bài.",
        annotations: [
          { quote: "the way how people work", kind: "grammar", title: "Dùng thừa từ để nối", body: "“The way” đã mang nghĩa “cách mà”, nên không dùng thêm “how” ngay sau đó.", fix: "the way people work" },
          { quote: "technology advances going to make", kind: "grammar", title: "Thiếu trợ động từ", body: "“Going to” cần động từ be theo sau chủ ngữ. Ngoài ra, “technological advances” tự nhiên hơn khi nói về những tiến bộ công nghệ.", fix: "technological advances are going to make" },
          { quote: "traditional skills and lifestyles", kind: "task", title: "Diễn đạt rộng hơn đề", body: "Đề hỏi cụ thể về báo và sách in. Gọi đúng đối tượng giúp bài bám sát câu hỏi hơn.", fix: "printed newspapers and books" }
        ],
        rewrite: "In recent decades, technological advances have transformed how people work, communicate and live. Some believe that free online content will eventually make printed newspapers and books obsolete. I disagree because print media offers a distinctive reading experience and continues to preserve cultural value."
      },
      {
        label: "THÂN BÀI 1",
        original: "Printed newspapers and books remain valuable because they provide readers with a more focused reading experience. Unlike digital devices, paper publications do not contain notifications or other distractions. For example, students can concentrate better when they read textbooks on paper, which helps them understand complex ideas. Therefore, printed materials are still useful in education.",
        summary: "Luận điểm phù hợp và có giải thích. Ví dụ có thể cụ thể hơn, đồng thời nên tránh khẳng định rộng rằng giấy luôn giúp người đọc tập trung tốt hơn.",
        annotations: [
          { quote: "remain valuable because", kind: "style", title: "Có thể làm rõ giá trị nào", body: "Đây là câu chủ đề tốt, nhưng nếu gọi tên lợi ích ngay sau đó thì lập luận sẽ sắc nét hơn.", fix: "remain valuable because they offer a distraction-free reading experience" },
          { quote: "students can concentrate better", kind: "evidence", title: "Khẳng định cần giới hạn", body: "Không phải mọi học sinh đều tập trung tốt hơn trên giấy. Dùng “may” hoặc giới hạn vào bối cảnh học tập để lập luận cân bằng.", fix: "students may find it easier to concentrate when studying from printed textbooks" },
          { quote: "helps them understand complex ideas", kind: "development", title: "Giải thích thêm cơ chế", body: "Hãy nối sự tập trung với hành động cụ thể như ghi chú, đánh dấu và xem lại nội dung.", fix: "allowing them to annotate key ideas and review difficult passages more easily" }
        ],
        rewrite: "Printed books and newspapers remain useful because they offer a focused reading experience. Paper pages contain no notifications, and readers can annotate or revisit important passages easily. For instance, students preparing for an exam may find printed textbooks helpful when they need to compare diagrams and make notes beside complex explanations."
      },
      {
        label: "THÂN BÀI 2",
        original: "Another reason why printed materials will not disappear is they have cultural and sentimental values. Many people enjoy collecting books and newspapers, especially the first editions or books which are connected with important events. These items can be passed through generations and remind people about their family history. This shows that paper publications have more functions than just giving information.",
        summary: "Ý về giá trị văn hóa và tình cảm có tiềm năng. Cần sửa cấu trúc ngữ pháp và giải thích rõ hơn cách giá trị này duy trì nhu cầu mua ấn phẩm.",
        annotations: [
          { quote: "is they have", kind: "grammar", title: "Thiếu “that” hoặc “because”", body: "Sau “the reason is” thường cần mệnh đề bắt đầu bằng “that”, hoặc có thể diễn đạt quan hệ nguyên nhân bằng “because”.", fix: "is that they have" },
          { quote: "the first editions", kind: "vocabulary", title: "Chọn cụm từ đúng ngữ cảnh", body: "Khi nói về các bản in đầu tiên của sách, “first editions” là cách dùng tự nhiên. Có thể thêm tính từ “rare” để cụ thể hóa.", fix: "rare first editions" },
          { quote: "passed through generations", kind: "collocation", title: "Kết hợp từ chưa tự nhiên", body: "Vật phẩm thường “be passed down from generation to generation”.", fix: "be passed down from one generation to the next" },
          { quote: "remind people about their family history", kind: "collocation", title: "Động từ đi với giới từ", body: "Cấu trúc thông dụng là “remind someone of something”.", fix: "remind people of their family history" }
        ],
        rewrite: "Printed publications also carry cultural and sentimental value. Book collectors, for example, may treasure rare first editions, while families often keep old photographs, letters or newspapers as records of important events. Such items can be passed down from one generation to the next, giving printed material a personal meaning that a freely available webpage cannot easily replace."
      },
      {
        label: "KẾT BÀI",
        original: "In conclusion, although online information is free and convenient, I believe printed books and newspapers will continue to exist. They can help people focus and also have a special cultural value. For these reasons, paper publications are unlikely to completely disappear.",
        summary: "Kết luận nhất quán với quan điểm, gọn và đủ ý. Có thể thay “help people focus” bằng cách diễn đạt học thuật và chính xác hơn.",
        annotations: [
          { quote: "help people focus", kind: "style", title: "Nâng cấp cách diễn đạt", body: "Cụm này đúng nghĩa nhưng hơi chung. “Support focused reading” súc tích và phù hợp văn phong học thuật hơn.", fix: "support focused reading" },
          { quote: "a special cultural value", kind: "vocabulary", title: "Cụm danh từ chưa tự nhiên", body: "Dùng “cultural significance” để diễn đạt tầm quan trọng về văn hóa một cách tự nhiên.", fix: "cultural significance" }
        ],
        rewrite: "In conclusion, although online content is convenient and often free, printed newspapers and books are unlikely to disappear entirely. Their ability to support focused reading, together with their cultural and sentimental significance, will continue to attract readers."
      }
    ],
    modelEssay: [
      "Digital technology has made an enormous range of reading material available online at little or no cost. Some therefore predict that printed newspapers and books will eventually disappear. I disagree with this view, as print continues to offer practical advantages and holds cultural value that digital formats cannot fully replace.",
      "One reason printed publications are likely to remain popular is that they can support focused reading. Online readers are frequently interrupted by notifications, advertisements and links to other content, whereas a printed book provides a more controlled environment. This can be particularly useful for students who need to annotate a text, compare diagrams or revisit a difficult passage. Although digital tools also offer helpful features, some readers still find paper easier to use for sustained study.",
      "Print also has a personal and cultural dimension. People may keep a newspaper that recorded a historic event, or pass a much-loved book through their family. Collectors are also willing to pay for rare first editions, even when the same text can be downloaded free of charge. These examples show that printed material is not purchased solely to obtain information; its physical form can itself be meaningful.",
      "Admittedly, online media will continue to replace many routine purchases because it is cheaper and more convenient. Nevertheless, this change is more likely to reduce demand than eliminate it. As long as readers value a distraction-free experience, collectable editions and the personal attachment associated with physical books, printed publications will retain a place in society."
    ],
    takeaways: [
      "Bắt chước cấu trúc “I disagree, as …” để nêu lập trường và báo trước lý do.",
      "Mỗi đoạn thân bài có một luận điểm, sau đó giải thích cơ chế trước khi đưa ví dụ.",
      "Dùng “reduce demand” thay cho khẳng định tuyệt đối “make something disappear”."
    ]
  }
];
