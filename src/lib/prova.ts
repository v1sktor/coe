export interface ProvaQuestao {
  n: number;
  enunciado: string;
  opcoes: string[];
  correta: number;
}

export const QUESTOES_PARTE_1: ProvaQuestao[] = [
  {
    n: 1,
    enunciado: "Qual é a principal função da Polícia Civil?",
    opcoes: [
      "Fazer patrulhamento ostensivo",
      "Investigar crimes e conduzir inquéritos",
      "Aplicar multas de trânsito",
      "Controlar hospitais",
    ],
    correta: 1,
  },
  {
    n: 2,
    enunciado: "O que um Delegado deve fazer ao chegar em uma cena de homicídio?",
    opcoes: [
      "Liberar imediatamente o local",
      "Isolar a área e iniciar os procedimentos investigativos",
      "Retirar o corpo sozinho",
      "Ignorar testemunhas",
    ],
    correta: 1,
  },
  {
    n: 3,
    enunciado: "Em quais situações a Polícia Civil pode solicitar mandado de busca e apreensão?",
    opcoes: [
      "Em qualquer abordagem de rotina",
      "Apenas em acidentes de trânsito",
      "Quando houver indícios de crime e necessidade de provas",
      "Apenas em perseguições",
    ],
    correta: 2,
  },
  {
    n: 4,
    enunciado: "Como funciona a investigação de organização criminosa?",
    opcoes: [
      "Apenas com patrulhamento nas ruas",
      "Com coleta de provas, escutas e monitoramento",
      "Somente por denúncias anônimas",
      "Sem autorização judicial",
    ],
    correta: 1,
  },
  {
    n: 5,
    enunciado: "Qual a diferença entre Polícia Civil e Polícia Militar?",
    opcoes: [
      "Nenhuma diferença",
      "A Civil investiga e a Militar faz policiamento ostensivo",
      "A Militar investiga homicídios",
      "A Civil controla o trânsito exclusivamente",
    ],
    correta: 1,
  },
  {
    n: 6,
    enunciado: "O que caracteriza flagrante delito?",
    opcoes: [
      "Quando o suspeito já foi condenado",
      "Quando o crime está acontecendo ou acabou de acontecer",
      "Quando existe denúncia anônima",
      "Quando o suspeito foge da cidade",
    ],
    correta: 1,
  },
  {
    n: 7,
    enunciado: "Como um Investigador deve agir ao coletar provas?",
    opcoes: [
      "Mexendo em tudo rapidamente",
      "Preservando o local e registrando as evidências",
      "Ignorando impressões digitais",
      "Compartilhando provas com civis",
    ],
    correta: 1,
  },
  {
    n: 8,
    enunciado: "Qual a importância do boletim de ocorrência?",
    opcoes: [
      "Apenas gerar multas",
      "Servir como documento decorativo",
      "Registrar oficialmente fatos e crimes",
      "Liberar presos automaticamente",
    ],
    correta: 2,
  },
  {
    n: 9,
    enunciado: "Em quais casos um suspeito pode permanecer em silêncio?",
    opcoes: [
      "Nunca",
      "Durante interrogatórios e depoimentos",
      "Apenas em perseguições",
      "Somente após condenação",
    ],
    correta: 1,
  },
  {
    n: 10,
    enunciado: "Como funciona a cadeia de custódia de provas?",
    opcoes: [
      "Qualquer pessoa pode manipular as provas",
      "As provas devem ser preservadas e registradas corretamente",
      "As provas podem ser destruídas após apreensão",
      "Apenas Delegados podem tocar nas provas",
    ],
    correta: 1,
  },
  {
    n: 11,
    enunciado: "Qual procedimento deve ser seguido após prisão em flagrante?",
    opcoes: [
      "Liberar o suspeito imediatamente",
      "Ignorar testemunhas",
      "Registrar ocorrência e apresentar à autoridade competente",
      "Encerrar investigação",
    ],
    correta: 2,
  },
  {
    n: 12,
    enunciado: "O que é necessário para iniciar um inquérito policial?",
    opcoes: [
      "Apenas vontade do policial",
      "Indícios de autoria e materialidade do crime",
      "Ordem de um civil",
      "Aprovação de facção criminosa",
    ],
    correta: 1,
  },
];

export const QUESTOES_PARTE_2: ProvaQuestao[] = [
  {
    n: 13,
    enunciado: "Como a SJD atua em casos de abuso policial?",
    opcoes: [
      "Acobertando policiais",
      "Investigando condutas irregulares",
      "Apenas emitindo multas",
      "Ignorando denúncias",
    ],
    correta: 1,
  },
  {
    n: 14,
    enunciado: "Quais são os principais departamentos especializados da Polícia Civil?",
    opcoes: [
      "Corpo de Bombeiros e SAMU",
      "DEIC, DECAP E DOPE",
      "CET e DETRAN",
      "Guarda Municipal e Exército",
    ],
    correta: 1,
  },
  {
    n: 15,
    enunciado: "Qual deve ser a postura de um Escrivão durante depoimentos?",
    opcoes: [
      "Alterar informações",
      "Registrar tudo de forma imparcial e correta",
      "Ignorar declarações",
      "Fazer ameaças ao suspeito",
    ],
    correta: 1,
  },
  {
    n: 16,
    enunciado: "Como funciona uma operação conjunta entre Civil e Militar?",
    opcoes: [
      "Cada equipe age por si só, sem comunicação",
      "Atuam de forma coordenada em objetivos específicos",
      "A Militar realiza e a Civil monitora",
      "Apenas a Civil pode agir armada",
    ],
    correta: 1,
  },
  {
    n: 17,
    enunciado: "O que pode invalidar uma prova criminal?",
    opcoes: [
      "Registro correto da ocorrência",
      "Uso de perícia técnica",
      "Obtenção ilegal da prova",
      "Preservação da cena do crime",
    ],
    correta: 2,
  },
  {
    n: 18,
    enunciado: "Como deve ser feita a abordagem de um suspeito armado?",
    opcoes: [
      "Sem planejamento",
      "Com agressão imediata",
      "Com cautela, verbalização e segurança da equipe",
      "Ignorando riscos",
    ],
    correta: 2,
  },
  {
    n: 19,
    enunciado: "O que caracteriza abuso de autoridade?",
    opcoes: [
      "Cumprir a lei corretamente",
      "Exceder limites legais durante ação policial",
      "Registrar ocorrência",
      "Realizar investigação autorizada",
    ],
    correta: 1,
  },
  {
    n: 20,
    enunciado: "Como investigadores podem infiltrar-se em organizações criminosas?",
    opcoes: [
      "Revelando identidade policial",
      "Atuando de forma sigilosa e estratégica",
      "Sem autorização superior",
      "Fazendo transmissões ao vivo",
    ],
    correta: 1,
  },
  {
    n: 21,
    enunciado: "Qual a importância do Boletim de Identificação?",
    opcoes: [
      "Apenas produzir fotos",
      "Identificar evidências e ajudar na resolução do crime",
      "Substituir testemunhas",
      "Liberar suspeitos automaticamente",
    ],
    correta: 1,
  },
  {
    n: 22,
    enunciado: "Qual seria a punição adequada para vazamento de informações sigilosas?",
    opcoes: [
      "Promoção automática",
      "Advertência verbal apenas",
      "Investigação, expulsão e possível prisão",
      "Nenhuma punição",
    ],
    correta: 2,
  },
];

export const QUESTOES_OBJETIVAS = [...QUESTOES_PARTE_1, ...QUESTOES_PARTE_2];

export const QUESTOES_DISSERTATIVAS = [
  {
    n: 23,
    enunciado:
      "Descreva ao seu ver, o motivo pelo o qual você faria diferença na Polícia Civil:",
  },
  {
    n: 24,
    enunciado:
      "Um policial da sua equipe quebra regras internas em uma operação ou investigação. O que você faria?",
  },
  {
    n: 25,
    enunciado: "Você sabe trabalhar sob hierarquia e seguir ordens superiores? Justifique:",
  },
];

export const PERIODOS = ["MANHÃ", "TARDE", "NOITE"];

export function corrigirObjetivas(respostas: Record<string, string>) {
  let acertos = 0;
  for (const q of QUESTOES_OBJETIVAS) {
    if (respostas[`q${q.n}`] === q.opcoes[q.correta]) acertos++;
  }
  return acertos;
}
