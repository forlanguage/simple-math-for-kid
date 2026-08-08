export const curriculum = [
  {
    level: 1,
    grade: 'Lớp 1', emoji: '🌱', title: 'Khởi đầu cùng những con số', color: 'mint',
    chapters: [
      { id:'numbers-10', icon:'🐣', name:'Các số từ 0 đến 10', note:'Đếm, nhận biết, thứ tự và cấu tạo số', lessons:[
        {id:'count-10',title:'Đếm trong phạm vi 10',learn:['Chạm từng đồ vật và đếm lần lượt từ 1.','Số cuối cùng là số lượng của cả nhóm.'],practice:'count'},
        {id:'number-before-after-10',title:'Số liền trước – liền sau',learn:['Số liền sau lớn hơn 1 đơn vị.','Số liền trước bé hơn 1 đơn vị.'],practice:'beforeAfter10'},
        {id:'compose-10',title:'Tách và gộp số đến 10',learn:['Một số có thể tách thành hai phần.','Ví dụ: 7 gồm 5 và 2.'],practice:'compose10'},
      ]},
      { id:'numbers-20', icon:'🔢', name:'Các số đến 20', note:'Đọc, thứ tự và so sánh các số', lessons:[
        {id:'count-20',title:'Đếm tiếp đến 20',learn:['Sau 10 là 11, 12, 13… đến 20.','Có thể đếm tiến hoặc đếm lùi.'],practice:'count20'},
        {id:'compare-20',title:'So sánh số đến 20',learn:['Dùng > khi bên trái lớn hơn.','Dùng < khi bên trái bé hơn.','Dùng = khi hai số bằng nhau.'],practice:'compare'},
        {id:'order-20',title:'Sắp xếp số',learn:['Trên trục số, số ở bên phải lớn hơn.','Tìm số bé nhất hoặc lớn nhất trước.'],practice:'order20'},
      ]},
      { id:'add-10', icon:'➕', name:'Phép cộng đến 10', note:'Gộp nhóm, đếm tiếp và tính nhẩm', lessons:[
        {id:'add-with-pictures',title:'Cộng bằng hình ảnh',learn:['Phép cộng là gộp hai nhóm.','Đếm tất cả đồ vật sau khi gộp.'],practice:'add10'},
        {id:'missing-addend-10',title:'Điền số còn thiếu',learn:['Tìm số cần thêm để được tổng đã cho.','Có thể đếm tiếp để tìm số còn thiếu.'],practice:'missingAdd10'},
        {id:'add-story-10',title:'Bài toán thêm vào',learn:['Từ “thêm”, “có thêm” thường gợi ý phép cộng.','Đọc câu hỏi rồi chọn phép tính phù hợp.'],practice:'storyAdd10'},
      ]},
      { id:'sub-10', icon:'➖', name:'Phép trừ đến 10', note:'Bớt đi, còn lại và tìm hiệu', lessons:[
        {id:'sub-with-pictures',title:'Trừ bằng hình ảnh',learn:['Phép trừ có thể hiểu là bớt đi.','Đếm số còn lại sau khi bớt.'],practice:'sub10'},
        {id:'missing-sub-10',title:'Điền số trong phép trừ',learn:['Dùng phép cộng ngược để kiểm tra.','Ví dụ: 8 − ? = 5 thì 5 + ? = 8.'],practice:'missingSub10'},
        {id:'sub-story-10',title:'Bài toán bớt đi',learn:['Từ “cho đi”, “bớt”, “bay đi” thường gợi ý phép trừ.','Tìm số còn lại.'],practice:'storySub10'},
      ]},
      { id:'add-sub-20', icon:'🚂', name:'Cộng và trừ đến 20', note:'Luyện tính nhẩm trong phạm vi 20', lessons:[
        {id:'add-20',title:'Cộng trong phạm vi 20',learn:['Đếm tiếp từ số lớn hơn.','Có thể tách số để tạo thành 10 trước.'],practice:'add20'},
        {id:'sub-20',title:'Trừ trong phạm vi 20',learn:['Đếm lùi để tìm kết quả.','Có thể dùng phép cộng để kiểm tra.'],practice:'sub20'},
        {id:'mixed-20',title:'Cộng trừ hỗn hợp',learn:['Quan sát kỹ dấu + hoặc −.','Tính từng câu chậm và chính xác.'],practice:'mixed20'},
      ]},
      { id:'shapes-position', icon:'🔺', name:'Hình học & vị trí', note:'Hình cơ bản và định hướng không gian', lessons:[
        {id:'shapes-1',title:'Hình quanh em',learn:['Hình tròn không có góc.','Tam giác có 3 cạnh.','Hình vuông có 4 cạnh bằng nhau.'],practice:'shapes1'},
        {id:'position-1',title:'Trái – phải – trên – dưới',learn:['Quan sát vị trí của đồ vật so với nhau.','Xác định bên trái, bên phải, phía trên và phía dưới.'],practice:'position1'},
      ]},
      { id:'measure-time', icon:'📏', name:'Độ dài & thời gian', note:'So sánh độ dài và xem giờ đúng', lessons:[
        {id:'length-1',title:'Dài hơn – ngắn hơn',learn:['Đặt hai vật cùng điểm bắt đầu để so sánh.','Vật kéo dài xa hơn thì dài hơn.'],practice:'length1'},
        {id:'time-1',title:'Xem giờ đúng',learn:['Kim ngắn chỉ giờ.','Kim phút ở số 12 là giờ đúng.'],practice:'time1'},
      ]},
      { id:'word-problems', icon:'📖', name:'Toán có lời văn', note:'Đọc hiểu và chọn phép tính', lessons:[
        {id:'choose-operation-1',title:'Chọn phép cộng hay trừ',learn:['Thêm vào thường dùng cộng.','Bớt đi hoặc còn lại thường dùng trừ.'],practice:'chooseOperation1'},
        {id:'word-mix-1',title:'Thử thách bài toán lớp 1',learn:['Đọc chậm đề bài.','Tìm dữ kiện, câu hỏi rồi mới tính.'],practice:'wordMix1'},
      ]},
    ],
  },
  { level:2, grade:'Lớp 2', emoji:'🚀', title:'Bay xa với phép tính', color:'sky', chapters:[
    {id:'numbers-1000',icon:'💯',name:'Số đến 1000',note:'Trăm, chục, đơn vị',lessons:[{id:'place-value',title:'Giá trị hàng',learn:['352 = 3 trăm + 5 chục + 2 đơn vị.'],practice:'placeValue'},{id:'compare-1000',title:'So sánh số đến 1000',learn:['So sánh hàng trăm trước.'],practice:'compare1000'}]},
    {id:'operations-2',icon:'🧮',name:'Cộng, trừ, nhân, chia',note:'Tính toán và bảng 2, 5',lessons:[{id:'add-sub-1000',title:'Cộng trừ có nhớ',learn:['Đặt các chữ số cùng hàng thẳng cột.'],practice:'addSub1000'},{id:'mul-2-5',title:'Bảng nhân 2 và 5',learn:['Nhân 2 là gấp đôi.'],practice:'mul25'}]},
    {id:'measure-money',icon:'📏',name:'Đo lường & tiền Việt Nam',note:'cm, m và tiền',lessons:[{id:'length-2',title:'Xăng-ti-mét và mét',learn:['100 cm = 1 m.'],practice:'length2'},{id:'money-2',title:'Làm quen tiền Việt Nam',learn:['Tiền thừa = tiền đưa − giá món hàng.'],practice:'money2'}]},
  ]},
  {level:3,grade:'Lớp 3',emoji:'🧭',title:'Khám phá thế giới Toán',color:'violet',chapters:[{id:'numbers-100k',icon:'🏙️',name:'Số đến 100 000',note:'Đọc, viết, so sánh',lessons:[{id:'numbers-3',title:'Số lớn hơn',learn:['So sánh từ chữ số hàng cao nhất.'],practice:'large3'}]},{id:'mul-div',icon:'⚡',name:'Nhân & chia',note:'Bảng nhân chia',lessons:[{id:'mul-div-3',title:'Nhân chia thành thạo',learn:['Phép chia là phép tính ngược của phép nhân.'],practice:'muldiv3'}]},{id:'geometry-3',icon:'📐',name:'Chu vi & diện tích',note:'Hình chữ nhật',lessons:[{id:'area-3',title:'Diện tích hình chữ nhật',learn:['Diện tích = chiều dài × chiều rộng.'],practice:'area3'}]}]},
  {level:4,grade:'Lớp 4',emoji:'🪐',title:'Chinh phục thử thách lớn',color:'orange',chapters:[{id:'big-numbers',icon:'🌍',name:'Số tự nhiên lớn',note:'Hàng, lớp',lessons:[{id:'big-4',title:'Tính với số lớn',learn:['Đặt tính thẳng hàng.'],practice:'large4'}]},{id:'fractions-4',icon:'🥧',name:'Phân số',note:'Cộng và trừ',lessons:[{id:'fraction-4',title:'Cộng phân số cùng mẫu',learn:['Giữ mẫu và cộng tử.'],practice:'fraction4'}]},{id:'average',icon:'⚖️',name:'Trung bình cộng',note:'Giải toán',lessons:[{id:'avg-4',title:'Tìm trung bình cộng',learn:['Tổng ÷ số lượng.'],practice:'average4'}]}]},
  {level:5,grade:'Lớp 5',emoji:'🏆',title:'Trở thành cao thủ Toán',color:'rose',chapters:[{id:'decimal',icon:'🔬',name:'Số thập phân',note:'Bốn phép tính',lessons:[{id:'decimal-5',title:'Cộng số thập phân',learn:['Đặt dấu phẩy thẳng cột.'],practice:'decimal5'}]},{id:'percent',icon:'💯',name:'Tỉ số phần trăm',note:'Phần trăm thực tế',lessons:[{id:'percent-5',title:'Tìm phần trăm của một số',learn:['a% của b = b × a ÷ 100.'],practice:'percent5'}]},{id:'motion',icon:'🚲',name:'Chuyển động đều',note:'Quãng đường',lessons:[{id:'motion-5',title:'Quãng đường',learn:['Quãng đường = vận tốc × thời gian.'],practice:'motion5'}]}]},
]

export const allLessons = curriculum.flatMap(level => level.chapters.flatMap(chapter => chapter.lessons.map(lesson => ({...lesson,level:level.level,grade:level.grade,chapterId:chapter.id,chapterName:chapter.name,chapterIcon:chapter.icon}))))
