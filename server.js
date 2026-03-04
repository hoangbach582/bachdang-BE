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
const axios = require("axios");

app.post("/convert", async (req, res) => {
    try {
        const { sub1, sub2, link } = req.body;

        if (!link) {
            return res.status(400).json({ error: "Thiếu link gốc" });
        }

        // 1. Tạo link dài có gắn SubID để Shopee ghi nhận hoa hồng
        const longUrl = `${link}${link.includes('?') ? '&' : '?'}sub_id1=${sub1}&sub_id2=${sub2}`;

        // 2. Gọi API Bitly để rút gọn link này
        const bitlyResponse = await axios.post(
            'https://api-ssl.bitly.com/v4/shorten',
            {
                long_url: longUrl,
                domain: "bit.ly"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.BITLY_TOKEN}`, // Dùng biến môi trường
                    'Content-Type': 'application/json'
                }
            }
        );

        // 3. Trả kết quả về cho Frontend
        res.json({ 
            success: true, 
            shortLink: bitlyResponse.data.link 
        });

    } catch (err) {
        console.error("Lỗi Bitly:", err.response ? err.response.data : err.message);
        res.status(500).json({ error: "Không thể rút gọn link qua Bitly" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server chạy tại port " + PORT);
});