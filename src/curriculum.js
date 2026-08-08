export const curriculum = [
  {
    level: 1,
    grade: 'Lớp 1',
    emoji: '🌱',
    title: 'Khởi đầu cùng những con số',
    color: 'mint',
    chapters: [
      {
        id: 'numbers-20', icon: '🔢', name: 'Các số đến 20', note: 'Đếm, đọc, viết và so sánh',
        lessons: [
          { id: 'count-10', title: 'Đếm trong phạm vi 10', learn: ['Mỗi đồ vật được đếm đúng một lần.', 'Số cuối cùng cho biết có tất cả bao nhiêu đồ vật.'], practice: 'count' },
          { id: 'compare-20', title: 'So sánh số đến 20', learn: ['Dùng > khi số bên trái lớn hơn.', 'Dùng < khi số bên trái bé hơn.', 'Dùng = khi hai số bằng nhau.'], practice: 'compare' },
        ],
      },
      {
        id: 'add-sub-20', icon: '➕', name: 'Cộng và trừ đến 20', note: 'Tính nhẩm và bài toán đơn giản',
        lessons: [
          { id: 'add-10', title: 'Phép cộng trong phạm vi 10', learn: ['Phép cộng là gộp hai nhóm lại với nhau.', 'Có thể đếm tiếp từ số lớn hơn để tính nhanh.'], practice: 'add10' },
          { id: 'sub-20', title: 'Phép trừ trong phạm vi 20', learn: ['Phép trừ là bớt đi hoặc tìm phần còn lại.', 'Có thể đếm lùi để kiểm tra kết quả.'], practice: 'sub20' },
        ],
      },
      {
        id: 'shapes-time', icon: '🔺', name: 'Hình học & thời gian', note: 'Nhận biết hình và xem giờ đúng',
        lessons: [
          { id: 'shapes-1', title: 'Hình quanh em', learn: ['Hình tròn không có góc.', 'Hình tam giác có 3 cạnh.', 'Hình vuông có 4 cạnh bằng nhau.'], practice: 'shapes1' },
          { id: 'time-1', title: 'Xem giờ đúng', learn: ['Kim ngắn chỉ giờ.', 'Khi kim phút chỉ số 12, ta đọc giờ đúng.'], practice: 'time1' },
        ],
      },
    ],
  },
  {
    level: 2,
    grade: 'Lớp 2',
    emoji: '🚀',
    title: 'Bay xa với phép tính',
    color: 'sky',
    chapters: [
      {
        id: 'numbers-1000', icon: '💯', name: 'Số đến 1000', note: 'Trăm, chục, đơn vị',
        lessons: [
          { id: 'place-value', title: 'Giá trị hàng', learn: ['Một số có thể gồm hàng trăm, hàng chục và hàng đơn vị.', 'Ví dụ 352 = 3 trăm + 5 chục + 2 đơn vị.'], practice: 'placeValue' },
          { id: 'compare-1000', title: 'So sánh số đến 1000', learn: ['So sánh hàng trăm trước, rồi đến hàng chục và hàng đơn vị.'], practice: 'compare1000' },
        ],
      },
      {
        id: 'operations-2', icon: '🧮', name: 'Cộng, trừ, nhân, chia', note: 'Tính toán có nhớ và bảng 2, 5',
        lessons: [
          { id: 'add-sub-1000', title: 'Cộng trừ có nhớ', learn: ['Đặt các chữ số cùng hàng thẳng cột.', 'Tính từ hàng đơn vị sang trái.'], practice: 'addSub1000' },
          { id: 'mul-2-5', title: 'Bảng nhân 2 và 5', learn: ['Nhân 2 là gấp đôi.', 'Các tích của bảng 5 tận cùng bằng 0 hoặc 5.'], practice: 'mul25' },
        ],
      },
      {
        id: 'measure-money', icon: '📏', name: 'Đo lường & tiền Việt Nam', note: 'cm, m, kg, lít và tiền',
        lessons: [
          { id: 'length-2', title: 'Xăng-ti-mét và mét', learn: ['100 cm = 1 m.', 'Chọn đơn vị phù hợp với độ dài cần đo.'], practice: 'length2' },
          { id: 'money-2', title: 'Làm quen tiền Việt Nam', learn: ['Có thể cộng giá trị các tờ tiền để tìm tổng số tiền.', 'Khi mua hàng, tiền thừa = tiền đưa − giá món hàng.'], practice: 'money2' },
        ],
      },
    ],
  },
  {
    level: 3,
    grade: 'Lớp 3', emoji: '🧭', title: 'Khám phá thế giới Toán', color: 'violet',
    chapters: [
      { id: 'numbers-100k', icon: '🏙️', name: 'Số đến 100 000', note: 'Đọc, viết, so sánh', lessons: [{ id: 'numbers-3', title: 'Số lớn hơn', learn: ['So sánh từ chữ số hàng cao nhất.'], practice: 'large3' }] },
      { id: 'mul-div', icon: '⚡', name: 'Nhân & chia', note: 'Bảng nhân chia và tính nhiều bước', lessons: [{ id: 'mul-div-3', title: 'Nhân chia thành thạo', learn: ['Phép chia là phép tính ngược của phép nhân.'], practice: 'muldiv3' }] },
      { id: 'geometry-3', icon: '📐', name: 'Chu vi & diện tích', note: 'Hình chữ nhật và hình vuông', lessons: [{ id: 'area-3', title: 'Diện tích hình chữ nhật', learn: ['Diện tích = chiều dài × chiều rộng.'], practice: 'area3' }] },
    ],
  },
  {
    level: 4,
    grade: 'Lớp 4', emoji: '🪐', title: 'Chinh phục thử thách lớn', color: 'orange',
    chapters: [
      { id: 'big-numbers', icon: '🌍', name: 'Số tự nhiên lớn', note: 'Hàng, lớp, làm tròn', lessons: [{ id: 'big-4', title: 'Tính với số lớn', learn: ['Đặt tính thẳng hàng để giảm sai sót.'], practice: 'large4' }] },
      { id: 'fractions-4', icon: '🥧', name: 'Phân số', note: 'So sánh, cộng và trừ', lessons: [{ id: 'fraction-4', title: 'Cộng phân số cùng mẫu', learn: ['Giữ nguyên mẫu số và cộng các tử số.'], practice: 'fraction4' }] },
      { id: 'average', icon: '⚖️', name: 'Trung bình cộng', note: 'Giải toán và suy luận', lessons: [{ id: 'avg-4', title: 'Tìm trung bình cộng', learn: ['Tổng các giá trị ÷ số lượng giá trị.'], practice: 'average4' }] },
    ],
  },
  {
    level: 5,
    grade: 'Lớp 5', emoji: '🏆', title: 'Trở thành cao thủ Toán', color: 'rose',
    chapters: [
      { id: 'decimal', icon: '🔬', name: 'Số thập phân', note: 'So sánh và bốn phép tính', lessons: [{ id: 'decimal-5', title: 'Cộng số thập phân', learn: ['Đặt dấu phẩy thẳng cột trước khi tính.'], practice: 'decimal5' }] },
      { id: 'percent', icon: '💯', name: 'Tỉ số phần trăm', note: 'Phần trăm trong thực tế', lessons: [{ id: 'percent-5', title: 'Tìm phần trăm của một số', learn: ['a% của b = b × a ÷ 100.'], practice: 'percent5' }] },
      { id: 'motion', icon: '🚲', name: 'Chuyển động đều', note: 'Quãng đường, vận tốc, thời gian', lessons: [{ id: 'motion-5', title: 'Quãng đường', learn: ['Quãng đường = vận tốc × thời gian.'], practice: 'motion5' }] },
    ],
  },
]

export const allLessons = curriculum.flatMap(level => level.chapters.flatMap(chapter => chapter.lessons.map(lesson => ({ ...lesson, level: level.level, grade: level.grade, chapterId: chapter.id, chapterName: chapter.name, chapterIcon: chapter.icon }))))
