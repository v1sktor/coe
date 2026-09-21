export interface UnidadeInstitucional {
  sigla: string;
  nome: string;
  subtitulo: string;
  missao: string;
  historia: string;
  contato: string;
}

export const INSTITUCIONAL: UnidadeInstitucional[] = [
  {
    sigla: "MB",
    nome: "Marinha do Brasil",
    subtitulo: "Marinha do Brasil",
    missao:
      "Preparar e empregar o Poder Naval, contribuindo para a defesa da Pátria, para a garantia dos poderes constitucionais e, por iniciativa de qualquer destes, da lei e da ordem, além de apoiar a política externa brasileira e contribuir para o desenvolvimento nacional e o bem-estar social.",
    historia:
      "A Marinha do Brasil tem origem em 1736, com a criação do Conselho do Almirantado, e foi consolidada como força naval nacional após a Independência, em 1822, quando Lorde Cochrane assumiu o comando da esquadra imperial. Ao longo de sua história, atuou em conflitos decisivos como a Guerra da Independência, a Guerra do Paraguai e a Segunda Guerra Mundial, além de sustentar missões de patrulha naval, defesa da Amazônia Azul e operações de paz. Hoje é organizada em Forças (Submarinos, Superfície, Aeronaval e Fuzileiros Navais), com estrutura de ensino, saúde e justiça próprias.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da Marinha do Brasil.",
  },
  {
    sigla: "DEnsM",
    nome: "Diretoria de Ensino da Marinha",
    subtitulo: "Diretoria de Ensino da Marinha (DEnsM) · Corpo da Armada",
    missao:
      "Planejar, orientar, coordenar e controlar as atividades de ensino da Marinha do Brasil, formando e aperfeiçoando oficiais e praças em todos os níveis de carreira, da formação inicial aos cursos de altos estudos.",
    historia:
      "A DEnsM é o órgão de direção setorial responsável por todo o sistema de ensino naval, supervisionando estabelecimentos como a Escola Naval, o Centro de Instrução Almirante Wandenkolk e demais centros de instrução espalhados pelo país. Sua atuação garante a padronização doutrinária e técnica de toda a força, da praça recém-incorporada ao oficial em curso de comando.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da Diretoria de Ensino da Marinha.",
  },
  {
    sigla: "JMU",
    nome: "Justiça Militar da União",
    subtitulo: "Justiça Militar da União (JMU)",
    missao:
      "Processar e julgar os crimes militares definidos em lei, bem como as ações judiciais contra atos disciplinares, zelando pela disciplina, hierarquia e legalidade dentro das Forças Armadas.",
    historia:
      "A Justiça Militar da União é o ramo do Poder Judiciário mais antigo do Brasil, com origem no Conselho Supremo Militar criado em 1808 por Dom João VI. Atua de forma independente das corporações militares, garantindo o devido processo legal a militares das três Forças, incluindo os integrantes da Marinha do Brasil.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais da Justiça Militar da União.",
  },
  {
    sigla: "ComForS",
    nome: "Comando da Força de Submarinos",
    subtitulo: "Comando da Força de Submarinos (ComForS) · Corpo da Armada",
    missao:
      "Preparar e manter operativos os submarinos da Marinha do Brasil, garantindo a capacidade de dissuasão, patrulha e ataque sob a superfície, e negar ao inimigo o uso do mar em caso de conflito.",
    historia:
      "O Comando da Força de Submarinos reúne toda a esquadrilha de submarinos convencionais e nucleares da Marinha, com base principal no Rio de Janeiro. É responsável pelo adestramento das guarnições, manutenção operacional e pelo desenvolvimento do Programa de Submarinos, incluindo a capacitação em propulsão nuclear.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Comando da Força de Submarinos.",
  },
  {
    sigla: "ComForSup",
    nome: "Comando da Força de Superfície",
    subtitulo: "Comando da Força de Superfície (ComForSup) · Corpo da Armada",
    missao:
      "Preparar e empregar os navios de superfície da Marinha do Brasil — fragatas, corvetas, navios-patrulha e o porta-aeronaves — para o controle de área marítima, escolta, patrulha naval e projeção de poder.",
    historia:
      "O Comando da Força de Superfície concentra o maior contingente de meios navais da Marinha, organizando os navios em esquadras e comandos táticos. É a espinha dorsal da presença naval brasileira em águas jurisdicionais e em operações internacionais de patrulha e cooperação.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Comando da Força de Superfície.",
  },
  {
    sigla: "VF-1",
    nome: "Esquadrão VF-1",
    subtitulo: "Esquadrão de Caça VF-1 · Força Aeronaval",
    missao:
      "Realizar interceptação aérea, superioridade aérea e ataque ao mar a partir de porta-aeronaves e bases em terra, garantindo a defesa aérea orgânica da Esquadra.",
    historia:
      "O VF-1 é o esquadrão de caça embarcado da Aviação Naval, historicamente ligado às operações do porta-aeronaves da Marinha. Suas aeronaves de asa fixa realizam patrulha aérea de combate e ataque, complementando a capacidade dos navios de superfície.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Esquadrão VF-1.",
  },
  {
    sigla: "HS-1",
    nome: "Esquadrão HS-1",
    subtitulo: "Esquadrão de Helicópteros Antissubmarino HS-1 · Força Aeronaval",
    missao:
      "Realizar buscas, detecção e ataque a submarinos inimigos a partir de helicópteros embarcados, protegendo a Esquadra contra ameaças subsuperfície.",
    historia:
      "O HS-1 opera helicópteros equipados com sonar e torpedos, atuando como extensão da capacidade antissubmarino dos navios de superfície. É peça-chave na segurança dos comboios e grupos-tarefa navais.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Esquadrão HS-1.",
  },
  {
    sigla: "HA-1",
    nome: "Esquadrão HA-1",
    subtitulo: "Esquadrão de Helicópteros de Ataque HA-1 · Força Aeronaval",
    missao:
      "Prestar apoio aéreo aproximado e ataque a alvos de superfície e terrestres, apoiando operações de Fuzileiros Navais e ações de interdição marítima.",
    historia:
      "O HA-1 é o esquadrão de helicópteros de ataque da Aviação Naval, empregado em apoio direto a desembarques anfíbios, escolta de comboios e combate a embarcações hostis, atuando lado a lado com o Corpo de Fuzileiros Navais.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Esquadrão HA-1.",
  },
  {
    sigla: "HU-1",
    nome: "Esquadrão HU-1",
    subtitulo: "Esquadrão de Helicópteros de Emprego Geral HU-1 · Força Aeronaval",
    missao:
      "Executar transporte de tropas e cargas, busca e salvamento, evacuação médica e apoio logístico embarcado e em terra para as forças navais.",
    historia:
      "O HU-1 é um dos esquadrões de emprego geral mais versáteis da Aviação Naval, presente em praticamente todas as operações que exigem transporte de pessoal, resgate ou apoio logístico aéreo.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Esquadrão HU-1.",
  },
  {
    sigla: "HU-2",
    nome: "Esquadrão HU-2",
    subtitulo: "Esquadrão de Helicópteros de Emprego Geral HU-2 · Força Aeronaval",
    missao:
      "Complementar a capacidade de transporte, busca e salvamento e apoio logístico aéreo da Força Aeronaval, operando a partir de navios e bases costeiras.",
    historia:
      "O HU-2 opera em conjunto com o HU-1 na missão de emprego geral, ampliando a cobertura da Aviação Naval em operações de resgate, transporte de tropas e apoio a unidades embarcadas ao longo do litoral brasileiro.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do Esquadrão HU-2.",
  },
  {
    sigla: "GRUMEC",
    nome: "Grupamento de Mergulhadores de Combate",
    subtitulo: "Grupamento de Mergulhadores de Combate (GRUMEC)",
    missao:
      "Realizar operações especiais em ambiente aquático e ribeirinho, incluindo reconhecimento de praias, sabotagem, ações diretas contra alvos navais e portuários, e resgate de reféns em ambiente marítimo.",
    historia:
      "Criado em 1969, o GRUMEC é a principal força de operações especiais da Marinha do Brasil, com doutrina inspirada nas unidades de combate subaquático de outras marinhas do mundo. Seus operadores passam por um dos processos seletivos mais rigorosos das Forças Armadas brasileiras, capacitando-os para atuar em ambientes hostis, subaquáticos e de selva.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do GRUMEC.",
  },
  {
    sigla: "GERR",
    nome: "Grupo Especial de Retomada e Resgate",
    subtitulo: "Grupo Especial de Retomada e Resgate — Mergulhadores de Combate (GERR)",
    missao:
      "Executar ações de contraterrorismo, retomada de embarcações e plataformas sequestradas e resgate de reféns em ambiente marítimo, portuário e ribeirinho, em apoio direto ao GRUMEC e ao Comando de Operações Especiais.",
    historia:
      "O GERR reúne os operadores mais experientes do GRUMEC especializados em contraterrorismo marítimo, formando a resposta de elite da Marinha para crises envolvendo embarcações, plataformas de petróleo e instalações portuárias. Organizacionalmente, integra-se também à 3ª Companhia do 1º Batalhão de Operações Especiais do Corpo de Fuzileiros Navais.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do GERR.",
  },
  {
    sigla: "1ºBPN",
    nome: "1º Batalhão de Polícia Naval",
    subtitulo: "1º Batalhão de Polícia Naval · Corpo de Fuzileiros Navais",
    missao:
      "Exercer o policiamento ostensivo em áreas, instalações e embarcações da Marinha do Brasil, garantindo a segurança orgânica, o controle de acesso e a ordem nas unidades navais.",
    historia:
      "O 1º Batalhão de Polícia Naval é a unidade do Corpo de Fuzileiros Navais responsável pela segurança física das instalações da Marinha, atuando de forma similar a uma polícia militar interna, com atribuições de policiamento, escolta e controle de perímetro.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do 1º Batalhão de Polícia Naval.",
  },
  {
    sigla: "3ºBBld",
    nome: "3º Batalhão de Blindados",
    subtitulo: "3º Batalhão de Blindados · Corpo de Fuzileiros Navais",
    missao:
      "Prover poder de fogo blindado e mobilidade tática ao Corpo de Fuzileiros Navais, empregando viaturas blindadas em operações de desembarque anfíbio e combate em terra.",
    historia:
      "O 3º Batalhão de Blindados equipa o Corpo de Fuzileiros Navais com carros de combate e blindados de transporte de pessoal, garantindo capacidade de choque e apoio blindado em operações anfíbias e terrestres conduzidas pela Marinha.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do 3º Batalhão de Blindados.",
  },
  {
    sigla: "5ºBArt",
    nome: "5º Batalhão de Artilharia",
    subtitulo: "5º Batalhão de Artilharia · Corpo de Fuzileiros Navais",
    missao:
      "Prover apoio de fogo indireto às tropas de Fuzileiros Navais em operações anfíbias e terrestres, empregando morteiros e obuses em apoio à manobra.",
    historia:
      "O 5º Batalhão de Artilharia é a unidade de apoio de fogo do Corpo de Fuzileiros Navais, responsável por planejar e executar o apoio artilheiro necessário para sustentar as operações de desembarque e combate terrestre da tropa anfíbia.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do 5º Batalhão de Artilharia.",
  },
  {
    sigla: "1ºBOE",
    nome: "1º Batalhão de Operações Especiais",
    subtitulo: "1º Batalhão de Operações Especiais (1º BOE) · Corpo de Fuzileiros Navais",
    missao:
      "Planejar e executar operações especiais terrestres em apoio às ações da Marinha do Brasil, incluindo reconhecimento avançado, ações de comando, contraterrorismo e apoio logístico especializado.",
    historia:
      "O 1º BOE reúne a capacidade de operações especiais do Corpo de Fuzileiros Navais, organizado em quatro companhias especializadas: a 1ª Companhia (RECON), responsável por reconhecimento avançado e vigilância; a 2ª Companhia (Ação de Comandos), voltada a ações diretas e incursões; a 3ª Companhia (GERR), dedicada ao contraterrorismo e retomada de reféns; e a 4ª Companhia (Apoio), responsável pela logística e suporte às demais companhias em operação.",
    contato:
      "Para informações institucionais, entre em contato pelos canais oficiais do 1º Batalhão de Operações Especiais.",
  },
];
