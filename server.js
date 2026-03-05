require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shopee Convert API Running with TinyURL v2...");
});

app.post("/convert", async (req, res) => {
    try {
        const { sub1, sub2, link } = req.body;

        if (!link) {
            return res.status(400).json({ error: "Thiếu link gốc" });
        }

        // 1. Tạo link dài có gắn SubID
        const longUrl = `${link}${link.includes('?') ? '&' : '?'}sub_id1=${sub1}&sub_id2=${sub2}`;

        // 2. Gọi API TinyURL v2 với Token của bạn
        const response = await axios.post(
            'https://api.tinyurl.com/create',
            {
                url: longUrl,
                domain: "tinyurl.com"
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TINYURL_TOKEN}`, // Sử dụng Token từ Variables
                    'Content-Type': 'application/json'
                }
            }
        );

        // 3. Trả kết quả về (TinyURL v2 trả về object, link nằm trong data.tiny_url)
        res.json({ 
            success: true, 
            shortLink: response.data.data.tiny_url 
        });

    } catch (err) {
        console.error("Lỗi TinyURL v2:", err.response ? err.response.data : err.message);
        res.status(500).json({ error: "Không thể rút gọn link qua TinyURL v2" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server chạy tại port " + PORT);
});