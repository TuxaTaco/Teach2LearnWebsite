import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase.js";

export const defaultTeam = [
  { id:"7bc5b4e4-4dd8-4f32-91e0-30e20cd8a8f1", name:"Iris Shen", role:"President", image:"/iris-shen.png", sortOrder:0 },
  { id:"a97b770b-e648-4a18-b920-70e4af307b7f", name:"Rayhan Papar", role:"Vice President", image:"/rayhan-papar.png", sortOrder:1 },
  { id:"6a3d932a-4908-4d67-bd75-1a9e0a235f82", name:"Sanjan Sarang", role:"Mentor & Workshop Development Lead", image:"/sanjan-sarang.png", sortOrder:2 },
];

export const defaultBoards = [
  { id:"6f80ee50-c385-4f5c-85c0-7b16322c23e7", title:"Science Fair Board · 2023–24", preview:"/boards/board-01.png", url:"https://www.canva.com/design/DAF9i5gFgUQ/kNrqyRJF2UbsNZ57-NfuTg/view?utm_campaign=designshare&utm_content=DAF9i5gFgUQ&utm_medium=link&utm_source=editor", sortOrder:0 },
  { id:"3268d702-f104-4293-af7a-02df23e0d3be", title:"Science Fair Board · 2022–23", preview:"/boards/board-02.png", url:"https://www.canva.com/design/DAF9i7jEHo8/qeyn0WoxZuBnFoAsRhDoig/view?utm_campaign=designshare&utm_content=DAF9i7jEHo8&utm_medium=link&utm_source=editor", sortOrder:1 },
  { id:"399b2480-f2bc-4b12-a41e-83f113f48d80", title:"ISEF-Qualifying Board · Felix Li", preview:"/boards/board-03.png", url:"https://www.canva.com/design/DAF9TjvfhJk/hgb0vtw7CVM4gRv-CrXgiw/view?utm_campaign=designshare&utm_content=DAF9TjvfhJk&utm_medium=link&utm_source=editor", sortOrder:2 },
  { id:"95c3b4ce-63f9-48ef-9e4a-af74a5bb8e5a", title:"Jose Barrios & William Li", preview:"/boards/board-04.png", url:"https://www.canva.com/design/DAGcCcz8qd0/-ijGHT3rXj1vcB8AAVYbqQ/view?utm_content=DAGcCcz8qd0&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h710f1bac93", sortOrder:3 },
  { id:"c686e32a-a91f-4f14-96a5-f43aec62219f", title:"Krushal & William", preview:"/boards/board-05.png", url:"https://www.canva.com/design/DAF416k09Hk/T5ZnZKx6SOvY0eb5kYzerQ/view?utm_campaign=designshare&utm_content=DAF416k09Hk&utm_medium=link&utm_source=editor", sortOrder:4 },
  { id:"fd893d50-cdfd-4499-beb2-5a894d498d59", title:"Science Fair Board Example", preview:"/boards/board-06.png", url:"https://www.canva.com/design/DAF9i6RGr9g/esANlhOIMy3SaBqqFAneYQ/view?utm_campaign=designshare&utm_content=DAF9i6RGr9g&utm_medium=link&utm_source=editor", sortOrder:5 },
  { id:"28b93e4b-b8b1-461c-a10e-6a53d7647e2e", title:"Science Fair Board · 2023–24", preview:"/boards/board-07.png", url:"https://www.canva.com/design/DAF9i1UWv-E/4ucZIuaLk5jPESDJrb3Ccg/view?utm_campaign=designshare&utm_content=DAF9i1UWv-E&utm_medium=link&utm_source=editor", sortOrder:6 },
  { id:"6e1d67a3-5250-415c-8da0-e1e68759bec6", title:"Science Fair Board · 2024–25", preview:"/boards/board-08.png", url:"https://www.canva.com/design/DAGchcT1gPA/xmbdGDpsP-nBG4MBfjp12g/view?utlId=hf70e4fd15c&utm_campaign=designshare&utm_content=DAGchcT1gPA&utm_medium=link2&utm_source=uniquelinks", sortOrder:7 },
];

const SiteContentContext = createContext({ team:defaultTeam, boards:defaultBoards, loading:false, refresh:async () => {} });

const mapMember = (row) => ({ id:row.id, name:row.name, role:row.role, image:row.image_url, sortOrder:row.sort_order });
const mapBoard = (row) => ({ id:row.id, title:row.title, preview:row.preview_url, url:row.destination_url, sortOrder:row.sort_order });

export function SiteContentProvider({ children }) {
  const [team, setTeam] = useState(defaultTeam);
  const [boards, setBoards] = useState(defaultBoards);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  async function refresh() {
    if (!supabase) return;
    setLoading(true);
    const [teamResult, boardResult] = await Promise.all([
      supabase.from("team_members").select("*").order("sort_order"),
      supabase.from("science_fair_boards").select("*").order("sort_order"),
    ]);

    if (!teamResult.error) setTeam(teamResult.data.map(mapMember));
    if (!boardResult.error) setBoards(boardResult.data.map(mapBoard));
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  return <SiteContentContext.Provider value={{ team, boards, loading, refresh }}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
