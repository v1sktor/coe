import jsPDF from "jspdf";
import logoUrl from "@/assets/logo-pcsp.png";

const loadDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const fmtDate = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? String(v) : d.toLocaleString("pt-BR");
};

const fmtDateTime = (v?: string) => {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  const date = d.toLocaleDateString("pt-BR");
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${date} às ${time}`;
};

const val = (v: any) => {
  if (v === null || v === undefined || v === "" || v === 0) return "—";
  return String(v);
};

const gerarNumeroRegistro = (rso: any) => {
  if (rso.numero_registro) return rso.numero_registro;
  const ano = rso.created_at ? new Date(rso.created_at).getFullYear() : new Date().getFullYear();
  const hex = (rso.id || "").replace(/-/g, "").slice(0, 6);
  const num = parseInt(hex, 16) % 1000000;
  return `${String(num).padStart(6, "0")}/${ano}`;
};

export interface RsoPdfInput {
  rso: Record<string, any>;
  membrosMap: Record<string, string>;
  anexosUrls?: string[];
  duracao?: string;
}

export const generateRsoPdf = async ({ rso, membrosMap, anexosUrls = [], duracao = "—" }: RsoPdfInput) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = M;

  const logo = await loadDataUrl(logoUrl);

  const footer = () => {
    const pages = doc.getNumberOfPages();
    const numeroRegistro = gerarNumeroRegistro(rso);
    const agora = fmtDateTime(new Date().toISOString());
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setDrawColor(200);
      doc.line(M, H - 58, W - M, H - 58);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(90);
      const line1 = "Documento gerado automaticamente pelo Sistema Integrado de Gestão Operacional.";
      const line2 = `Registro nº ${numeroRegistro} • Gerado em ${agora}`;
      const line3 = "Documento destinado ao registro e controle interno das atividades operacionais.";
      doc.text(line1, M, H - 45);
      doc.text(line2, M, H - 35);
      doc.text(line3, M, H - 25);
      doc.text(`Página ${i} de ${pages}`, W - M, H - 25, { align: "right" });
    }
  };

  const ensure = (need = 60) => {
    if (y + need > H - 60) {
      doc.addPage();
      y = M;
    }
  };

  const header = () => {
    const numeroRegistro = gerarNumeroRegistro(rso);
    const status = String(rso.status || "").toUpperCase() || "—";
    const dataFimPatrulha = fmtDateTime(rso.patrulha_fim);

    if (logo) {
      try {
        doc.addImage(logo, "PNG", M, y - 6, 54, 54);
      } catch {
        /* ignore */
      }
    }

    const centerX = W / 2;
    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("POLÍCIA CIVIL DO ESTADO DE SÃO PAULO", centerX, y + 12, { align: "center" });
    doc.setFontSize(11);
    doc.text("REGISTRO DE DILIGÊNCIA", centerX, y + 28, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(80);
    doc.text("Sistema Integrado de Gestão Operacional", centerX, y + 42, { align: "center" });

    const rightX = W - M;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(20);
    doc.text(`Nº do Registro: ${numeroRegistro}`, rightX, y + 10, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text(`Data: ${dataFimPatrulha}`, rightX, y + 24, { align: "right" });
    doc.setFont("helvetica", "bold");
    if (status === "APROVADO") {
      doc.setTextColor(34, 120, 60);
    } else {
      doc.setTextColor(180, 60, 60);
    }
    doc.text(`Status: ${status}`, rightX, y + 38, { align: "right" });

    y += 62;
    doc.setDrawColor(30, 64, 120);
    doc.setLineWidth(1.4);
    doc.line(M, y, W - M, y);
    doc.setLineWidth(0.5);
    y += 20;
  };

  const section = (title: string) => {
    ensure(50);
    doc.setFillColor(238, 242, 248);
    doc.rect(M, y - 11, W - M * 2, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 64, 120);
    doc.text(title.toUpperCase(), M + 6, y + 1.5);
    y += 20;
  };

  const rows = (items: [string, any][]) => {
    const colW = (W - M * 2) / 2;
    for (let i = 0; i < items.length; i += 2) {
      ensure(24);
      const pair = items.slice(i, i + 2);
      pair.forEach(([label, value], c) => {
        const x = M + c * colW;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(110);
        doc.text(String(label).toUpperCase(), x, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(25);
        const lines = doc.splitTextToSize(val(value), colW - 14);
        doc.text(lines.slice(0, 2), x, y + 12);
      });
      y += 28;
    }
    y += 4;
  };

  const block = (label: string, value?: string) => {
    ensure(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(110);
    doc.text(label.toUpperCase(), M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(25);
    const lines = doc.splitTextToSize(value?.trim() || "—", W - M * 2);
    doc.text(lines, M, y + 13);
    y += 13 + lines.length * 12 + 8;
  };

  const nome = (id?: string) => (id ? membrosMap[id] || "—" : "—");

  header();

  // Status stamp
  doc.setDrawColor(34, 120, 60);
  doc.setTextColor(34, 120, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const status = String(rso.status || "").toUpperCase();
  doc.rect(W - M - 110, y - 12, 110, 22);
  doc.text(status || "—", W - M - 55, y + 3, { align: "center" });
  doc.setTextColor(25);
  doc.setFontSize(9);
  doc.text(`Protocolo: ${String(rso.id || "").slice(0, 8).toUpperCase()}`, M, y + 3);
  y += 30;

  section("Informações Gerais");
  rows([
    ["Responsável", rso.autor_nome],
    ["Modelo da Viatura", rso.prefixo_viatura],
    ["Unidade", rso.prefixo_unidade],
    ["Local", rso.local],
    ["Data da Ocorrência", rso.data_ocorrencia ? new Date(rso.data_ocorrencia).toLocaleDateString("pt-BR") : "—"],
    ["Registrado em", fmtDate(rso.created_at)],
    ["Início da Patrulha", fmtDate(rso.patrulha_inicio)],
    ["Fim da Patrulha", fmtDate(rso.patrulha_fim)],
    ["Duração Total", duracao],
    ["Status", status],
  ]);

  section("Guarnição");
  rows([
    ["Encarregado", nome(rso.encarregado_id)],
    ["Motorista", nome(rso.motorista_id)],
    ["3º Homem", nome(rso.homem3_id)],
    ["4º Homem", nome(rso.homem4_id)],
    ["5º Homem", nome(rso.homem5_id)],
    ["Responsável (cadastro)", nome(rso.responsavel_id)],
  ]);

  section("Material Apreendido");
  rows([
    ["Cocaína", rso.ilicito_cocaina],
    ["Ecstasy", rso.ilicito_ecstasy],
    ["Cigarros", rso.ilicito_cigarros],
    ["Pistolas", rso.ilicito_pistolas],
    ["Fuzis", rso.ilicito_fuzis],
    ["Submetralhadoras", rso.ilicito_submetralhadoras],
    ["Mun. Pistola", rso.ilicito_mun_pistola],
    ["Mun. Fuzil", rso.ilicito_mun_fuzil],
    ["Mun. Submetralhadora", rso.ilicito_mun_sub],
    ["Lockpicks", rso.ilicito_lockpicks],
    ["Bombas Caseiras", rso.ilicito_bombas],
    ["Dinheiro Marcado", rso.ilicito_dinheiro_marcado],
  ]);
  if (rso.outros_ilicitos) block("Outros Ilícitos", rso.outros_ilicitos);

  section("Ocorrências Atendidas");
  rows([
    ["Roubos a Residências", rso.roubos_residencias],
    ["Caixa Eletrônico", rso.caixa_eletronico],
    ["Roubo Cx. Registradora", rso.roubo_caixa_registradora],
    ["Roubo de Veículo", rso.roubo_veiculo],
    ["Pinote / Apoio", rso.pinote_apoio],
    ["O11 (Disparo)", rso.o11_disparo],
    ["Ações Setada", rso.acoes_setada],
    ["Tráfico de Drogas", rso.trafico_drogas],
    ["Chamados 190", rso.chamados_190],
  ]);
  if (rso.prisoes_bopm) block("Prisões (BOPM)", rso.prisoes_bopm);
  if (rso.multas_descricao) block("Multas Aplicadas", rso.multas_descricao);
  if (rso.outras_ocorrencias) block("Outras Ocorrências", rso.outras_ocorrencias);

  section("Descrição do Serviço");
  block("Relato", rso.descricao);

  if (rso.motivo_rejeicao) {
    section("Motivo da Reprovação");
    block("Motivo", rso.motivo_rejeicao);
  }

  // Assinaturas
  ensure(90);
  y += 20;
  const sigW = (W - M * 2 - 40) / 2;
  doc.setDrawColor(120);
  doc.line(M, y, M + sigW, y);
  doc.line(M + sigW + 40, y, W - M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text(String(rso.autor_nome || "Responsável"), M, y + 12);
  doc.text("Autoridade Responsável pela Aprovação", M + sigW + 40, y + 12);

  // Anexos
  if (anexosUrls.length) {
    doc.addPage();
    y = M;
    section("Anexos Fotográficos");
    const imgW = (W - M * 2 - 16) / 2;
    const imgH = imgW * 0.62;
    let col = 0;
    for (let i = 0; i < anexosUrls.length; i++) {
      const data = await loadDataUrl(anexosUrls[i]);
      if (!data) continue;
      if (col === 0) ensure(imgH + 24);
      const x = M + col * (imgW + 16);
      try {
        doc.addImage(data, "JPEG", x, y, imgW, imgH);
      } catch {
        continue;
      }
      doc.setFontSize(7.5);
      doc.setTextColor(110);
      doc.text(`Anexo ${i + 1}`, x, y + imgH + 10);
      col++;
      if (col === 2) {
        col = 0;
        y += imgH + 24;
      }
    }
  }

  footer();
  const nomeArq = `RSO_${String(rso.autor_nome || "relatorio").replace(/\s+/g, "_")}_${String(rso.id || "").slice(0, 8)}.pdf`;
  doc.save(nomeArq);
};
