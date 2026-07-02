import * as powerbi from "powerbi-client";

window.onload = () => {
  loadReport();
};

async function loadReport() {
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");

  loader.style.display = "flex";
  reportContainer.style.display = "block";

  const embedUrl = "https://app.powerbi.com/reportEmbed?reportId=c1dd388a-a664-43ff-ad25-6b0c6adabe81&groupId=3155d8d0-9725-40c1-b9f4-0ebdd5e9706c&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVLLVNPVVRILUQtUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImVtYmVkRmVhdHVyZXMiOnsidXNhZ2VNZXRyaWNzVk5leHQiOnRydWV9fQ%3d%3d";
  const reportId = "c1dd388a-a664-43ff-ad25-6b0c6adabe81";
  const embedToken = "H4sIAAAAAAAEAB3Sx66DVhSF4Xe5UyJRTI2UAR1M75gZmHIOBkxvUd49N5nvyf7W__ePm1_dNy9__vwpK-iUMmXIaGBkVwETNsq_wYzYkSsTOad9r3UylkF7I4QybVU6DqMY3XSBOgdJC16BeW-7GPbJRlZ8hQ1mka-u6J5rzzF4nfkHyK12JbSlfWoYfq-9hVmrrzZcYzvAT0xP-NKqZ-YsBmTRJ-4pKhzri3dg7aXUCrP5M08-vSx5ztwWvuaISFwQn0QHjh_0delLNwY7humHghg7iFRqDyYhTs3M4wCtEvbuU8NIrrdeQILTox1ctWGQxda_RMFy20d5DeOSznhKzakHPeMkFW63Nyg-0uoY4sTaKMRknjUI9exDRDzGRsCTs1N4K_TUZOWpHTItJshjAs8-iI3XEqDZ-cxIjKuDYRJvo_yoFlPL5CJmhqe86IimPKfAkvgjzGIzmo2gea7jxuIYLQQAhMb79cGiWkpI0XEljEkwvt4DIyQY-hIaafQxGaFemWhXa7IGYXiGQ5u-Wdo3yqRtOPqrwd8fak46kvSTbcs65MpDvh6yfB40xKTkJS_v65g4WBZIt3S8WtMRJ5x6b9Nid1hg9bDUsOOW0Cp33taYl6gWhlHIChjYEdMNYYHqLIOQ0SN_hviZ1C6e4xzyoKQ58aG49enXgfdncLMKUCz6SoNNGpzxNlldGhBk4Q0OCC5VL084vHfdcCLMJ6FopP63-LoTt4gGHalqvj0cdTymC3noUrz75YviG5wBJPTecVuiIadIuIw7k1VYUgNvLnI9700PvMBQRMRShLh8LBjvS9TLet7Kf_388SPO17h-jer6TV95C0nP0b423x47ZO9pHoKMK3Bb2CV5LYaNx19y-JXo3eoLrHHa_MPy9AUYR1-gc_q155ZqHsuPp8hrDJYykRh3u0y7is71DZmn_VIrrSryM25qDDGo5maZ-aiDPFU8p52Qzk8Gpuuxuzr44dv63VNTMjPvtBESokhWTSQs876QaLvXV0p9k9HKgCGhDNGZnqixgo529Oa1Aw_MX346RvZQcJ7SQ1bI5gxuI5JyfQI8v1lkxiFMGfZoNEWDmdyW7IslrWw7LzR-7DDrFsRcbwiVHPjjkGTN0fPZaAEbPJ_abvvptr_doDgJTEhDDHtyoDvOsTsV8pVvsxhiviSwT4k0j7_-Z75GUM16_KvczGegKtRywtTym0cchR8zaP6_CmAz5Os2V_-NQam-S0QJZc8TC6jyg77vvb_52PptT-Cxc7CTcGn9-H6gCV2_RGiJwWipVfUFWCrnzJOhtXy17JcnLraSMpjlGQUSbN6s18F7POJhe9gsJu7m-pG0xhj1AFKiO1bgzXHwDt2b0OUpcDFbhkv0Gj_BNSZhAwDG8bkWlfewI5GCWcHOITChDQvA4CMl2SSLSBazRlOTEuHU4eNRUOZL8jU2NStlRJhNutnJcweJxWJ3LWU6bynsxGNV5-w3mrlTDHo8LyJgApJNkmO829ZXixC4wTjOmWkfupLHG_UbQmhjOfmMUdRjWXBNNee4SFGcfmmdQXAhIYQhOVdZBYs3aS1A5H-Z__kXJXzsGu4FAAA=.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVVLLVNPVVRILUQtUFJJTUFSWS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldCIsImV4cCI6MTc4Mjk0Mjg0MiwiYWxsb3dBY2Nlc3NPdmVyUHVibGljSW50ZXJuZXQiOnRydWV9";

  const models = powerbi.models;

  const embedConfig = {
    type: "report",
    id: reportId,
    embedUrl: embedUrl,
    accessToken: embedToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      }
    }
  };

  const report = powerbi.embed(reportContainer, embedConfig);

  loader.style.display = "none";

  document.getElementById("nextPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);
    if (index < pages.length - 1) pages[index + 1].setActive();
  };

  document.getElementById("prevPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);
    if (index > 0) pages[index - 1].setActive();
  };

  document.getElementById("fullscreenBtn").onclick = () => {
    if (reportContainer.requestFullscreen) reportContainer.requestFullscreen();
  };
}
