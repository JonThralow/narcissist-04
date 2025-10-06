/**
 * Pure scoring utilities for the Narcissism item bank.
 * Not used by the API; provided for client-side apps.
 */

export type Item = { id: string; scaleId: 'NARC'; subscaleId: 'ADM'|'RIV'|'VUL'; text: string; reverseKeyed: boolean };
export type ResponseMap = Record<string, number>; // 1..5 Likert

export const ITEMS: Item[] = [
  { "id":"N1","scaleId":"NARC","subscaleId":"ADM","text":"I often feel I stand out in a crowd.","reverseKeyed":false },
  { "id":"N2","scaleId":"NARC","subscaleId":"ADM","text":"People benefit from having me as a leader.","reverseKeyed":false },
  { "id":"N3","scaleId":"NARC","subscaleId":"ADM","text":"I have a special talent that sets me apart.","reverseKeyed":false },
  { "id":"N4","scaleId":"NARC","subscaleId":"ADM","text":"I enjoy being the center of attention.","reverseKeyed":false },
  { "id":"N5","scaleId":"NARC","subscaleId":"ADM","text":"Compliments usually reflect the truth about me.","reverseKeyed":false },
  { "id":"N6","scaleId":"NARC","subscaleId":"ADM","text":"I prefer to stay unnoticed even when I do well.","reverseKeyed":true },
  { "id":"N7","scaleId":"NARC","subscaleId":"RIV","text":"If someone challenges me, I won’t back down.","reverseKeyed":false },
  { "id":"N8","scaleId":"NARC","subscaleId":"RIV","text":"I get irritated when others don’t recognize my worth.","reverseKeyed":false },
  { "id":"N9","scaleId":"NARC","subscaleId":"RIV","text":"I feel driven to come out on top.","reverseKeyed":false },
  { "id":"N10","scaleId":"NARC","subscaleId":"RIV","text":"Criticism usually says more about the critic than me.","reverseKeyed":false },
  { "id":"N11","scaleId":"NARC","subscaleId":"RIV","text":"I don’t like seeing others get praise I deserve.","reverseKeyed":false },
  { "id":"N12","scaleId":"NARC","subscaleId":"RIV","text":"I’m fine with others taking the spotlight.","reverseKeyed":true },
  { "id":"N13","scaleId":"NARC","subscaleId":"VUL","text":"I worry people will see my flaws.","reverseKeyed":false },
  { "id":"N14","scaleId":"NARC","subscaleId":"VUL","text":"I need reassurance that I’m valued.","reverseKeyed":false },
  { "id":"N15","scaleId":"NARC","subscaleId":"VUL","text":"I feel hurt easily when I’m ignored.","reverseKeyed":false },
  { "id":"N16","scaleId":"NARC","subscaleId":"VUL","text":"I’m preoccupied with how others judge me.","reverseKeyed":false },
  { "id":"N17","scaleId":"NARC","subscaleId":"VUL","text":"I rarely feel self-conscious around others.","reverseKeyed":true },
  { "id":"N18","scaleId":"NARC","subscaleId":"VUL","text":"I bounce back quickly when my ego is bruised.","reverseKeyed":true },
  { "id":"N19","scaleId":"NARC","subscaleId":"ADM","text":"I’m destined to achieve great things.","reverseKeyed":false },
  { "id":"N20","scaleId":"NARC","subscaleId":"ADM","text":"Others naturally look to me for direction.","reverseKeyed":false },
  { "id":"N21","scaleId":"NARC","subscaleId":"ADM","text":"I often feel my abilities exceed those around me.","reverseKeyed":false },
  { "id":"N22","scaleId":"NARC","subscaleId":"ADM","text":"I’m uncomfortable when attention turns to me.","reverseKeyed":true },
  { "id":"N23","scaleId":"NARC","subscaleId":"ADM","text":"I bring out the best in teams.","reverseKeyed":false },
  { "id":"N24","scaleId":"NARC","subscaleId":"ADM","text":"I enjoy showcasing my accomplishments.","reverseKeyed":false },
  { "id":"N25","scaleId":"NARC","subscaleId":"ADM","text":"I see myself as ordinary, not exceptional.","reverseKeyed":true },
  { "id":"N26","scaleId":"NARC","subscaleId":"ADM","text":"Recognition motivates me to push harder.","reverseKeyed":false },
  { "id":"N27","scaleId":"NARC","subscaleId":"RIV","text":"I dislike losing even in small matters.","reverseKeyed":false },
  { "id":"N28","scaleId":"NARC","subscaleId":"RIV","text":"I feel slighted when my ideas aren’t credited.","reverseKeyed":false },
  { "id":"N29","scaleId":"NARC","subscaleId":"RIV","text":"I tend to compete even with friends.","reverseKeyed":false },
  { "id":"N30","scaleId":"NARC","subscaleId":"RIV","text":"When criticized, I look for flaws in the critic.","reverseKeyed":false },
  { "id":"N31","scaleId":"NARC","subscaleId":"RIV","text":"I protect my status when it’s threatened.","reverseKeyed":false },
  { "id":"N32","scaleId":"NARC","subscaleId":"RIV","text":"I’m happy to let others win without minding.","reverseKeyed":true },
  { "id":"N33","scaleId":"NARC","subscaleId":"RIV","text":"I rarely compare myself to others.","reverseKeyed":true },
  { "id":"N34","scaleId":"NARC","subscaleId":"VUL","text":"I worry that praise won’t last.","reverseKeyed":false },
  { "id":"N35","scaleId":"NARC","subscaleId":"VUL","text":"I need reassurance after setbacks.","reverseKeyed":false },
  { "id":"N36","scaleId":"NARC","subscaleId":"VUL","text":"I replay social interactions looking for mistakes.","reverseKeyed":false },
  { "id":"N37","scaleId":"NARC","subscaleId":"VUL","text":"I’m sensitive to being overlooked.","reverseKeyed":false },
  { "id":"N38","scaleId":"NARC","subscaleId":"VUL","text":"I brush off social slights easily.","reverseKeyed":true },
  { "id":"N39","scaleId":"NARC","subscaleId":"VUL","text":"I hardly ever need validation from others.","reverseKeyed":true },
  { "id":"N40","scaleId":"NARC","subscaleId":"VUL","text":"I feel exposed when my work is evaluated.","reverseKeyed":false }
];

export const VARIANTS = {
  quick: ["N1","N3","N4","N6","N7","N11","N12","N14","N15","N17"],
  advanced: ["N1","N2","N3","N4","N6","N19","N25","N7","N8","N9","N12","N27","N31","N33","N13","N14","N15","N17","N18","N36"],
  precise: ITEMS.map(i => i.id)
} as const;

export function score(responses: ResponseMap) {
  const by = (sub: 'ADM'|'RIV'|'VUL') => {
    const items = ITEMS.filter(i => i.subscaleId === sub);
    const vals: number[] = [];
    for (const it of items) {
      if (responses[it.id] == null) continue;
      const raw = Number(responses[it.id]);
      const keyed = it.reverseKeyed ? (6 - raw) : raw;
      vals.push(keyed);
    }
    const needed = Math.ceil(0.8 * items.length);
    if (vals.length < needed) return NaN;
    // mean-impute one missing if >= 80% answered
    const mean = vals.reduce((a,b)=>a+b,0) / vals.length;
    if (vals.length < items.length) {
      vals.push(mean);
    }
    return vals.reduce((a,b)=>a+b,0) / vals.length;
  };
  const ADM = by('ADM');
  const RIV = by('RIV');
  const VUL = by('VUL');
  const TNI = [ADM,RIV,VUL].some(Number.isNaN) ? NaN : ((ADM + RIV + VUL) / 3);
  const band = (x: number) => {
    if (isNaN(x)) return 'Incomplete';
    if (x <= 2.2) return 'Low';
    if (x <= 3.2) return 'Typical';
    if (x <= 4.0) return 'Elevated';
    return 'High';
  };
  return { ADM, RIV, VUL, TNI, bands: { ADM: band(ADM), RIV: band(RIV), VUL: band(VUL), TNI: band(TNI) } };
}