"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Counter from "./Counter";

type MenuItem = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  img?: string;
  category: string;
  options?: { label: string; choices: { key: string; label: string; priceDelta?: number }[] }[];
};
type CartLine = { id: string; itemId: string; qty: number; selections: Record<string, string> };

// --- 데모 메뉴 (교체) ---
const MENU: MenuItem[] = [
  // 버거
  {
    id: "b01",
    name: "불고기 버거",
    desc: "달짝지근한 불고기 패티와 신선한 야채",
    price: 5900,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop",
    category: "버거",
    options: [
      { label: "세트", choices: [
        { key: "single", label: "단품" },
        { key: "set", label: "세트(+2,000)", priceDelta: 2000 }
      ]},
    ],
  },
  {
    id: "b02",
    name: "치즈 버거",
    desc: "치즈 듬뿍 클래식 버거",
    price: 5200,
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1600&auto=format&fit=crop",
    category: "버거",
    options: [
      { label: "세트", choices: [
        { key: "single", label: "단품" },
        { key: "set", label: "세트(+2,000)", priceDelta: 2000 }
      ]},
    ],
  },
  {
  id: "b03",
  name: "스파이시 치킨버거",
  desc: "바삭한 매콤 치킨 패티",
  price: 6400,
  img: "https://images.unsplash.com/photo-1606755962773-0c57fcd94e4f?q=80&w=1600&auto=format&fit=crop", // ✅ 새 이미지
  category: "버거",
  options: [
    { label: "세트", choices: [
      { key: "single", label: "단품" },
      { key: "set", label: "세트(+2,000)", priceDelta: 2000 }
    ]},
    { label: "맵기", choices: [
      { key: "mild", label: "순한맛" },
      { key: "hot", label: "매운맛" }
    ]}
  ],
},
{
  id: "b04",
  name: "베이컨 에그 버거",
  desc: "베이컨과 반숙 에그의 조화",
  price: 6800,
  img: "https://images.unsplash.com/photo-1625948579443-cfb12b056c97?q=80&w=1600&auto=format&fit=crop", // ✅ 새 이미지
  category: "버거",
  options: [
    { label: "세트", choices: [
      { key: "single", label: "단품" },
      { key: "set", label: "세트(+2,000)", priceDelta: 2000 }
    ]},
  ],
},

  // 사이드
  {
    id: "s01",
    name: "감자튀김",
    desc: "겉바속촉 프렌치 프라이",
    price: 2500,
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1600&auto=format&fit=crop", // ✅ 정상 이미지
    category: "사이드",
    options: [
      { label: "사이즈", choices: [
        { key: "s", label: "S" },
        { key: "m", label: "M(+500)", priceDelta: 500 },
        { key: "l", label: "L(+1,000)", priceDelta: 1000 }
      ]},
    ],
  },

  {
    id: "s02",
    name: "치킨 너겟",
    desc: "한 입에 쏙",
    price: 2800,
    img: "https://images.unsplash.com/photo-1625948645443-7fbb1c7b7390?q=80&w=1600&auto=format&fit=crop", // ✅ 새 이미지
    category: "사이드",
  },

  // 음료
  {
    id: "d01",
    name: "아메리카노",
    desc: "산미 밸런스 원두",
    price: 3000,
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1600&auto=format&fit=crop",
    category: "음료",
    options: [
      { label: "사이즈", choices: [
        { key: "s", label: "S" },
        { key: "m", label: "M(+500)", priceDelta: 500 },
        { key: "l", label: "L(+1,000)", priceDelta: 1000 }
      ]},
      { label: "얼음", choices: [
        { key: "less", label: "적게" },
        { key: "normal", label: "보통" },
        { key: "more", label: "많이" }
      ]},
    ],
  },

  {
    id: "d02",
    name: "레몬에이드",
    desc: "상큼한 수제 에이드",
    price: 3500,
    img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1600&auto=format&fit=crop",
    category: "음료",
    options: [
      { label: "사이즈", choices: [
        { key: "s", label: "S" },
        { key: "m", label: "M(+500)", priceDelta: 500 },
        { key: "l", label: "L(+1,000)", priceDelta: 1000 }
      ]},
    ],
  },
  {
    id: "d03",
    name: "카푸치노",
    desc: "부드러운 우유 거품",
    price: 3800,
    img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop",
    category: "음료",
    options: [
      { label: "사이즈", choices: [
        { key: "s", label: "S" },
        { key: "m", label: "M(+500)", priceDelta: 500 },
        { key: "l", label: "L(+1,000)", priceDelta: 1000 }
      ]},
    ],
  },
  
  {
    id: "d04",
    name: "콜라",
    desc: "톡 쏘는 시원함",
    price: 2500,
    img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=1600&auto=format&fit=crop",
    category: "음료",
    options: [
      { label: "사이즈", choices: [
        { key: "s", label: "S" },
        { key: "m", label: "M(+500)", priceDelta: 500 },
        { key: "l", label: "L(+1,000)", priceDelta: 1000 }
      ]},
    ],
  },
];


const KRW = (v: number) => v.toLocaleString("ko-KR");

function priceWithSelections(item: MenuItem, sel: Record<string, string>) {
  let price = item.price;
  item.options?.forEach((opt) => {
    const key = sel[opt.label] ?? opt.choices[0].key;
    const c = opt.choices.find((x) => x.key === key);
    if (c?.priceDelta) price += c.priceDelta;
  });
  return price;
}
function signatureFor(item: MenuItem, sel: Record<string, string>) {
  const sig = item.options?.map((o) => `${o.label}:${sel[o.label] ?? o.choices[0].key}`).join("|") ?? "-";
  return `${item.id}__${sig}`;
}

export default function OrderScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("전체");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [isDialog, setIsDialog] = useState(false);
  const [busy, setBusy] = useState(false);           // 주문하기 로딩/중복방지
  const [banner, setBanner] = useState<string>("");  // 상단 성공/안내 배너
  const [thisYear, setThisYear] = useState<number | null>(null); // hydration 안전

  // 초기화/유지 (로컬스토리지)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("fastbite_cart");
      if (raw) setCart(JSON.parse(raw));
    } catch {}
    setThisYear(new Date().getFullYear());
  }, []);
  useEffect(() => {
    try { localStorage.setItem("fastbite_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  const categories = useMemo(() => ["전체", ...Array.from(new Set(MENU.map((m) => m.category)))], []);
  const filtered = useMemo(
    () => MENU.filter((m) => (activeCat === "전체" || m.category === activeCat) && (m.name.includes(query) || (m.desc ?? "").includes(query))),
    [activeCat, query]
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + priceWithSelections(MENU.find(m => m.id === line.itemId)!, line.selections) * line.qty, 0),
    [cart]
  );
  const tax = Math.round(subtotal * 0.1);
  const grand = subtotal + tax;

  const addToCart = (item: MenuItem, sel: Record<string, string>, qty: number) => {
    const id = signatureFor(item, sel);
    setCart((prev) => {
      const i = prev.findIndex((l) => l.id === id);
      if (i >= 0) { const next = [...prev]; next[i].qty += qty; return next; }
      return [...prev, { id, itemId: item.id, qty, selections: sel }];
    });
    setBanner("장바구니에 담겼습니다.");
    setTimeout(() => setBanner(""), 1500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const setQty = (id: string, qty: number) => setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty } : l)));
  const removeLine = (id: string) => setCart((prev) => prev.filter((l) => l.id !== id));

  // “장바구니 비우기” 버튼 동작: 확인 → 비우고 홈 상태로 리셋
  const clearAllAndHome = () => {
    if (!cart.length) return;
    if (!confirm("장바구니를 모두 비울까요?")) return;
    setCart([]);
    setQuery("");
    setActiveCat("전체");
    setIsDialog(false);
    setBanner("장바구니를 비웠습니다.");
    setTimeout(() => setBanner(""), 1500);
    router.push("/"); // 혹시 다른 경로에 있어도 메인으로
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 주문 API (모의) + 성공 후 비우고 메인으로
  async function placeOrder() {
    if (!cart.length || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, amount: grand }),
      });
      if (!res.ok) throw new Error("주문 실패");
      const data = await res.json();
      setBanner(`주문 완료! 주문번호: ${data.orderId}`);
      // 상태 초기화 & 메인으로
      setCart([]);
      setQuery("");
      setActiveCat("전체");
      setIsDialog(false);
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // 배너 2.5초 후 자동 닫힘
      setTimeout(() => setBanner(""), 2500);
    } catch (e) {
      alert("죄송합니다. 주문 처리 중 문제가 발생했습니다.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* 상단 알림 배너 */}
      {banner && (
        <div style={{
          position: "sticky", top: 0, zIndex: 50, background: "#111", color: "#fff",
          padding: "10px 16px", textAlign: "center"
        }}>
          {banner}
        </div>
      )}

      <header className="sticky">
        <div className="container flex between wrap" style={{ gap: 10, padding: "12px 16px" }}>
          <div className="title" style={{ fontSize: 20 }}>🍔 FastBite (Next.js + TS)</div>
          <div className="search" style={{ width: 260, maxWidth: "100%" }}>
            <span className="icon">🔎</span>
            <input placeholder="메뉴 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <button className="btn primary" onClick={() => setIsDialog(true)}>
            🧺 장바구니 <span className="pill" style={{ marginLeft: 6 }}>{cart.reduce((n, l) => n + l.qty, 0)}</span>
          </button>
        </div>
      </header>

      <main className="container">
        <div className="row">
          <section>
            <div className="flex wrap" style={{ gap: 8, margin: "10px 0 16px" }}>
              {categories.map((c) => (
                <button key={c}
                  className={`btn ${c === activeCat ? "primary" : ""}`}
                  onClick={() => setActiveCat(c)}
                >{c}</button>
              ))}
            </div>

            <div className="grid">
              {filtered.map((item) => <MenuCard key={item.id} item={item} onAdd={addToCart} />)}
            </div>
          </section>

          {/* 사이드 장바구니 */}
          <aside className="card" style={{ alignSelf: "start", position: "sticky", top: 76 }}>
            <div className="pad">
              <div className="flex between">
                <div className="title">주문 내역</div>
                <div className="pill">{cart.reduce((n, l) => n + l.qty, 0)} 개</div>
              </div>
              <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>선택한 상품을 확인하세요.</div>
            </div>
            <div className="pad list">
              {cart.length === 0 ? (
                <div className="muted" style={{ textAlign: "center", padding: 24 }}>장바구니가 비어있어요.</div>
              ) : (
                cart.map((line) => {
                  const item = MENU.find((m) => m.id === line.itemId)!;
                  const unit = priceWithSelections(item, line.selections);
                  return (
                    <div key={line.id} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <img src={item.img} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, background: "#ddd" }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          {item.options?.length ? (
                            <div className="muted" style={{ fontSize: 12 }}>
                              {item.options.map(o => {
                                const key = line.selections[o.label] ?? o.choices[0].key;
                                const choice = o.choices.find(x => x.key === key);
                                return `${o.label}: ${choice?.label}`;
                              }).join(" · ")}
                            </div>
                          ) : null}
                          <div className="muted" style={{ fontSize: 12 }}>개당 {KRW(unit)}원</div>
                        </div>
                      </div>
                      <div className="right">
                        <Counter value={line.qty} onChange={(n) => setQty(line.id, n)} />
                        <div style={{ fontWeight: 700, marginTop: 6 }}>합계 {KRW(unit * line.qty)}원</div>
                        <button className="btn" style={{ marginTop: 6 }} onClick={() => removeLine(line.id)}>삭제</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="pad">
              <div className="rowline"><span>상품 금액</span><span>{KRW(subtotal)}원</span></div>
              <div className="rowline"><span>부가세(10%)</span><span>{KRW(tax)}원</span></div>
              <div className="divider"></div>
              <div className="rowline" style={{ fontWeight: 700, fontSize: 16 }}><span>결제 금액</span><span>{KRW(grand)}원</span></div>
              <div className="flex" style={{ gap: 12, marginTop: 10 }}>
                <button className="btn" onClick={clearAllAndHome}>비우기</button>
                <button className="btn primary" disabled={!cart.length || busy} onClick={() => setIsDialog(true)}>
                  {busy ? "처리 중..." : "주문하기"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 주문 확인 모달 */}
      <div className={`dialog-backdrop ${isDialog ? "" : "hide"}`} onClick={() => !busy && setIsDialog(false)}>
        <div className="dialog" onClick={(e) => e.stopPropagation()}>
          <div className="title" style={{ display: "flex", gap: 8, alignItems: "center" }}>✅ 주문 확인</div>
          <div className="muted" style={{ margin: "6px 0 10px" }}>아래 내역으로 주문을 진행합니다.</div>
          <div className="list" style={{ maxHeight: "40vh" }}>
            {cart.map((line) => {
              const item = MENU.find((m) => m.id === line.itemId)!;
              const unit = priceWithSelections(item, line.selections);
              return (
                <div key={line.id} className="rowline">
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name} × {line.qty}</div>
                    {item.options?.length ? (
                      <div className="muted" style={{ fontSize: 12 }}>
                        {item.options.map(o => {
                          const key = line.selections[o.label] ?? o.choices[0].key;
                          const choice = o.choices.find(x => x.key === key);
                          return `${o.label}: ${choice?.label}`;
                        }).join(" · ")}
                      </div>
                    ) : null}
                  </div>
                  <div style={{ fontWeight: 700 }}>{KRW(unit * line.qty)}원</div>
                </div>
              );
            })}
          </div>
          <div className="divider"></div>
          <div className="rowline" style={{ fontWeight: 700 }}><span>총 결제</span><span>{KRW(grand)}원</span></div>
          <div className="flex" style={{ gap: 12, justifyContent: "space-between", marginTop: 12 }}>
            <button className="btn" disabled={busy} onClick={clearAllAndHome}>주문 비우기</button>
            <div>
              <button className="btn" disabled={busy} onClick={() => setIsDialog(false)} style={{ marginRight: 8 }}>뒤로</button>
              <button className="btn primary" disabled={!cart.length || busy} onClick={placeOrder}>
                {busy ? "결제 중..." : "결제하기"}
              </button>
            </div>
          </div>
          <div className="muted" style={{ fontSize: 12, textAlign: "right", marginTop: 8 }}>
            © {thisYear ?? ""} FastBite
          </div>
        </div>
      </div>
    </>
  );
}

function MenuCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem, sel: Record<string, string>, qty: number) => void }) {
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState<Record<string, string>>({});
  const unit = priceWithSelections(item, sel);

  return (
    <div className="card">
      <img src={item.img} alt={item.name} style={{ width: "100%", height: 150, objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16, background: "#ddd" }} />
      <div className="pad">
        <div className="flex between">
          <div>
            <div className="title">{item.name}</div>
            {item.desc && <div className="muted" style={{ fontSize: 14 }}>{item.desc}</div>}
          </div>
        <div className="right" style={{ fontWeight: 700 }}>
        {KRW(unit)}원
        <div className="muted" style={{ fontSize: 12 }}>
          (옵션 반영가)
        </div>
        </div>
        </div>


        {item.options?.map((opt) => (
          <div key={opt.label} style={{ marginTop: 8 }}>
            <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>{opt.label}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {opt.choices.map((c, idx) => {
                const selectedKey = sel[opt.label] ?? opt.choices[0].key;
                const selected = selectedKey === c.key || (idx === 0 && sel[opt.label] === undefined);
                return (
                  <button
                    key={c.key}
                    className={`btn ${selected ? "primary" : ""}`}
                    onClick={() => setSel((s) => ({ ...s, [opt.label]: c.key }))}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex between" style={{ marginTop: 10 }}>
          <Counter value={qty} onChange={setQty} />
          <button className="btn primary" onClick={() => onAdd(item, sel, qty)}>담기</button>
        </div>
      </div>
    </div>
  );
}
