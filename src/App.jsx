import { useRef, useState } from "react";

const categories = [
  "影戏", "灯戏", "三花白", "唱经", "夜歌",
  "快板", "小调", "山歌", "故事", "笑话", "其他"
];

const questions = [
  { zh: "你最早是什么时候学会这个的？", pj: "你最先是么里时分学整嘎？" },
  { zh: "是谁教你的？", pj: "是谁教你嘎？" },
  { zh: "你第一次上场还记得吗？", pj: "你头次上场还记得叵啰？" },
  { zh: "那时候一般有哪些人来？", pj: "箇时分哈有吖么里人来啰？" },
  { zh: "以前最热闹的是哪一次？", pj: "早先最热闹格是辇回啰？" },
  { zh: "你先讲/唱/演一段吧。", pj: "你先话/唱/演段啧啦。" },
  { zh: "后来呢？", pj: "后背呢？" },
  { zh: "还有呢？", pj: "还有呢？" },
  { zh: "你再讲详细一点。", pj: "你再话清场吖啰。" },
  { zh: "现在还会的人多不多？", pj: "如今还搞得整格人多不多啰？" },
];

export default function App() {
  const [speakerId, setSpeakerId] = useState("");
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [phone, setPhone] = useState("");
  const [wechat, setWechat] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [category, setCategory] = useState("影戏");

  const [agreed, setAgreed] = useState(false);
  const [quiet, setQuiet] = useState(false);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const now = new Date().toISOString().replaceAll(":", "-").slice(0, 19);
  const fileName = `${speakerId || "NOID"}_${category}_${now}.webm`;

  async function startRecording() {
    if (!agreed) {
      alert("请先确认：资料为自愿、无偿提供，并同意用于研究保存。");
      return;
    }

    if (!quiet) {
      alert("请先确认：现在环境相对安静，适合录音。");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setPaused(false);
      setAudioURL("");
    } catch (err) {
      alert("无法启动录音：" + err.message);
    }
  }

  function pauseRecording() {
    if (mediaRecorderRef.current && recording && !paused) {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  }

  function resumeRecording() {
    if (mediaRecorderRef.current && recording && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPaused(false);
    }
  }

  const box = {
    background: "white",
    borderRadius: 24,
    padding: 20,
  };

  const input = {
    width: "100%",
    padding: 14,
    borderRadius: 16,
    border: "1px solid #ccc",
    marginBottom: 12,
    fontSize: 16,
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f2ea",
      padding: 16,
      fontFamily: "sans-serif"
    }}>
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}>

        <div style={{ ...box, textAlign: "center" }}>
         <img
  src="/logo.png"
  alt="平江"
  style={{
    width: "220px",
    display: "block",
    margin: "0 auto 16px auto"
  }}
/>

          <h2 style={{ fontSize: 24, fontWeight: "bold", lineHeight: 1.4 }}>
            他们还记得，<br />我们还来得及
          </h2>

          <p style={{ color: "#555", lineHeight: 1.7, marginTop: 16, textAlign: "left" }}>
            本项目用于记录平江方言、民间故事、影戏、唱经、夜歌等口承文化资料。
            受访者可自行录音，也可由家属协助录制。
          </p>

          <p style={{ color: "#555", lineHeight: 1.7, textAlign: "left" }}>
            所有资料均为自愿、无偿提供，用于学术研究、文化保存与整理。
            请尽量在安静环境中录音，避免电视声、车辆声、风声、多人同时说话等干扰。
          </p>

          <p style={{ fontWeight: "bold", marginTop: 12 }}>
            联系人微信：pianggong
          </p>

          <label style={{ display: "flex", gap: 10, marginTop: 12, textAlign: "left" }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>已知悉：资料为自愿、无偿提供，并同意用于研究保存</span>
          </label>

          <label style={{ display: "flex", gap: 10, marginTop: 12, textAlign: "left" }}>
            <input
              type="checkbox"
              checked={quiet}
              onChange={(e) => setQuiet(e.target.checked)}
            />
            <span>已确认：现在环境相对安静，适合录音</span>
          </label>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 22, fontWeight: "bold" }}>采访对象</h2>

          <input
            style={input}
            placeholder="采访编号：例如 YX001 / CJ001"
            value={speakerId}
            onChange={(e) => setSpeakerId(e.target.value)}
          />

          <input
            style={input}
            placeholder="姓名（内部记录，可不公开）"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={input}
            placeholder="村镇 / 地点"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />

          <input
            style={input}
            placeholder="联系电话（可选）"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            style={input}
            placeholder="微信号（可选）"
            value={wechat}
            onChange={(e) => setWechat(e.target.value)}
          />

          <select
            style={input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>

          <label style={{ display: "flex", gap: 10 }}>
            <input
              type="checkbox"
              checked={followUp}
              onChange={(e) => setFollowUp(e.target.checked)}
            />
            <span>愿意后续联系与补充调查</span>
          </label>
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 22, fontWeight: "bold" }}>核心问题</h2>

          {questions.map((q, i) => (
            <button
              key={i}
              style={{
                width: "100%",
                background: "#111",
                color: "white",
                padding: 16,
                borderRadius: 18,
                border: "none",
                marginBottom: 10,
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: "bold" }}>
                Q{i + 1}. {q.pj}
              </div>
              <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                {q.zh}
              </div>
            </button>
          ))}
        </div>

        <div style={box}>
          <h2 style={{ fontSize: 22, fontWeight: "bold" }}>录音控制</h2>

          {!recording && (
            <button
              onClick={startRecording}
              style={{
                width: "100%",
                background: "#dc2626",
                color: "white",
                padding: 22,
                borderRadius: 24,
                border: "none",
                fontSize: 24,
                fontWeight: "bold"
              }}
            >
              ● 开始录音
            </button>
          )}

          {recording && !paused && (
            <button
              onClick={pauseRecording}
              style={{
                width: "100%",
                background: "#f59e0b",
                color: "white",
                padding: 20,
                borderRadius: 24,
                border: "none",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 12
              }}
            >
              ⏸ 暂停
            </button>
          )}

          {recording && paused && (
            <button
              onClick={resumeRecording}
              style={{
                width: "100%",
                background: "#16a34a",
                color: "white",
                padding: 20,
                borderRadius: 24,
                border: "none",
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 12
              }}
            >
              ▶ 继续
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              style={{
                width: "100%",
                background: "#111",
                color: "white",
                padding: 20,
                borderRadius: 24,
                border: "none",
                fontSize: 22,
                fontWeight: "bold"
              }}
            >
              ■ 终止并保存
            </button>
          )}

          {recording && (
            <p style={{
              marginTop: 12,
              color: paused ? "#b45309" : "#dc2626",
              fontWeight: "bold"
            }}>
              状态：{paused ? "已暂停，可随时继续" : "正在录音"}
            </p>
          )}

          {audioURL && (
            <div style={{ marginTop: 20 }}>
              <audio controls src={audioURL} style={{ width: "100%" }} />

              <a
                href={audioURL}
                download={fileName}
                style={{
                  display: "block",
                  marginTop: 12,
                  textAlign: "center",
                  background: "#2563eb",
                  color: "white",
                  padding: 14,
                  borderRadius: 16,
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                下载录音：{fileName}
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
