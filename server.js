require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shopee Convert API Running...");
});

// app.post("/convert", async (req, res) => {
//   try {
//     const { sub1, sub2, link } = req.body;

//     if (!link) {
//       return res.status(400).json({ error: "Thiếu link" });
//     }

//     // TODO: Sau này gọi API Shopee thật ở đây
//     const shortLink = `${link}?sub_id1=${sub1}&sub_id2=${sub2}`;

//     res.json({ success: true, shortLink });

//   } catch (err) {
//     res.status(500).json({ error: "Server lỗi" });
//   }
// });

app.post("/convert", async (req, res) => {
    try {
      const { sub1, sub2, link } = req.body;
  
      if (!link) {
        return res.status(400).json({ error: "Thiếu link" });
      }
  
      // LOGIC RÚT GỌN THẬT: Sau này bạn sẽ gọi Shopee API tại đây.
      // Hiện tại, chúng ta tạo ra một mã định danh ngẫu nhiên để link ngắn gọn.
      const randomId = Math.random().toString(36).substring(2, 10);
      const shortLink = `https://s.shopee.vn/${randomId}`;
  
      res.json({ success: true, shortLink });
  
    } catch (err) {
      res.status(500).json({ error: "Server lỗi" });
    }
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy tại port " + PORT);
});