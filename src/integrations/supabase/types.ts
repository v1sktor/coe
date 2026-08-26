export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          user_id: string
          user_nome: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          user_id: string
          user_nome?: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          user_id?: string
          user_nome?: string
        }
        Relationships: []
      }
      ait: {
        Row: {
          artigo: string
          created_at: string
          data_infracao: string
          descricao: string
          id: string
          nome_multado: string
          observacoes: string | null
          rg_multado: string | null
          rso_id: string | null
          updated_at: string
          valor: number
        }
        Insert: {
          artigo: string
          created_at?: string
          data_infracao?: string
          descricao: string
          id?: string
          nome_multado: string
          observacoes?: string | null
          rg_multado?: string | null
          rso_id?: string | null
          updated_at?: string
          valor?: number
        }
        Update: {
          artigo?: string
          created_at?: string
          data_infracao?: string
          descricao?: string
          id?: string
          nome_multado?: string
          observacoes?: string | null
          rg_multado?: string | null
          rso_id?: string | null
          updated_at?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "ait_rso_id_fkey"
            columns: ["rso_id"]
            isOneToOne: false
            referencedRelation: "rsos"
            referencedColumns: ["id"]
          },
        ]
      }
      apresentacao_content: {
        Row: {
          chave: string
          conteudo: string
          id: string
          ordem: number
          titulo: string | null
          updated_at: string
        }
        Insert: {
          chave: string
          conteudo?: string
          id?: string
          ordem?: number
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          chave?: string
          conteudo?: string
          id?: string
          ordem?: number
          titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      apresentacao_docs: {
        Row: {
          arquivo_url: string
          created_at: string
          descricao: string | null
          id: string
          ordem: number
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url: string
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string
          created_at?: string
          descricao?: string | null
          id?: string
          ordem?: number
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      cargo_permissoes: {
        Row: {
          cargo_id: string
          id: string
          permissao_id: string
        }
        Insert: {
          cargo_id: string
          id?: string
          permissao_id: string
        }
        Update: {
          cargo_id?: string
          id?: string
          permissao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cargo_permissoes_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cargo_permissoes_permissao_id_fkey"
            columns: ["permissao_id"]
            isOneToOne: false
            referencedRelation: "permissoes"
            referencedColumns: ["id"]
          },
        ]
      }
      cargos: {
        Row: {
          batalhao: string | null
          created_at: string
          id: string
          imagem_url: string | null
          nivel_hierarquico: number
          nome: string
          updated_at: string
        }
        Insert: {
          batalhao?: string | null
          created_at?: string
          id?: string
          imagem_url?: string | null
          nivel_hierarquico?: number
          nome: string
          updated_at?: string
        }
        Update: {
          batalhao?: string | null
          created_at?: string
          id?: string
          imagem_url?: string | null
          nivel_hierarquico?: number
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      ccomsoc_posts: {
        Row: {
          anexos: Json
          aprovado_em: string | null
          aprovado_por: string | null
          autor_id: string | null
          capa_url: string | null
          corpo: string
          created_at: string
          id: string
          motivo_rejeicao: string | null
          publicado: boolean
          resumo: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          anexos?: Json
          aprovado_em?: string | null
          aprovado_por?: string | null
          autor_id?: string | null
          capa_url?: string | null
          corpo?: string
          created_at?: string
          id?: string
          motivo_rejeicao?: string | null
          publicado?: boolean
          resumo?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          anexos?: Json
          aprovado_em?: string | null
          aprovado_por?: string | null
          autor_id?: string | null
          capa_url?: string | null
          corpo?: string
          created_at?: string
          id?: string
          motivo_rejeicao?: string | null
          publicado?: boolean
          resumo?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      denuncias: {
        Row: {
          anonima: boolean
          categoria: string
          contato: string | null
          created_at: string
          data_fato: string | null
          descricao: string
          id: string
          local_fato: string | null
          nome: string | null
          protocolo: string
          status: string
          unidade_envolvida: string | null
        }
        Insert: {
          anonima?: boolean
          categoria: string
          contato?: string | null
          created_at?: string
          data_fato?: string | null
          descricao: string
          id?: string
          local_fato?: string | null
          nome?: string | null
          protocolo?: string
          status?: string
          unidade_envolvida?: string | null
        }
        Update: {
          anonima?: boolean
          categoria?: string
          contato?: string | null
          created_at?: string
          data_fato?: string | null
          descricao?: string
          id?: string
          local_fato?: string | null
          nome?: string | null
          protocolo?: string
          status?: string
          unidade_envolvida?: string | null
        }
        Relationships: []
      }
      diretrizes_coe: {
        Row: {
          ano: number | null
          corpo: string
          created_at: string
          criado_por: string | null
          id: string
          numero: string | null
          pdf_url: string | null
          publicado: boolean
          tags: string[]
          titulo: string
          updated_at: string
          vigencia_fim: string | null
          vigencia_inicio: string | null
        }
        Insert: {
          ano?: number | null
          corpo?: string
          created_at?: string
          criado_por?: string | null
          id?: string
          numero?: string | null
          pdf_url?: string | null
          publicado?: boolean
          tags?: string[]
          titulo: string
          updated_at?: string
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Update: {
          ano?: number | null
          corpo?: string
          created_at?: string
          criado_por?: string | null
          id?: string
          numero?: string | null
          pdf_url?: string | null
          publicado?: boolean
          tags?: string[]
          titulo?: string
          updated_at?: string
          vigencia_fim?: string | null
          vigencia_inicio?: string | null
        }
        Relationships: []
      }
      estaticas: {
        Row: {
          anexos: Json
          created_at: string
          criado_por: string | null
          efetivo_previsto: number | null
          fim: string | null
          id: string
          inicio: string
          local: string
          observacoes: string | null
          updated_at: string
        }
        Insert: {
          anexos?: Json
          created_at?: string
          criado_por?: string | null
          efetivo_previsto?: number | null
          fim?: string | null
          id?: string
          inicio: string
          local: string
          observacoes?: string | null
          updated_at?: string
        }
        Update: {
          anexos?: Json
          created_at?: string
          criado_por?: string | null
          efetivo_previsto?: number | null
          fim?: string | null
          id?: string
          inicio?: string
          local?: string
          observacoes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hierarquia: {
        Row: {
          batalhao: string | null
          cargo_id: string | null
          created_at: string
          data_entrada: string | null
          discord_id: string | null
          funcao: string | null
          grupamento: Database["public"]["Enums"]["grupamento_tipo"]
          id: string
          membro_nome: string
          ordem: number
          promocao: string | null
          rg: string | null
          superior_id: string | null
          updated_at: string
        }
        Insert: {
          batalhao?: string | null
          cargo_id?: string | null
          created_at?: string
          data_entrada?: string | null
          discord_id?: string | null
          funcao?: string | null
          grupamento?: Database["public"]["Enums"]["grupamento_tipo"]
          id?: string
          membro_nome: string
          ordem?: number
          promocao?: string | null
          rg?: string | null
          superior_id?: string | null
          updated_at?: string
        }
        Update: {
          batalhao?: string | null
          cargo_id?: string | null
          created_at?: string
          data_entrada?: string | null
          discord_id?: string | null
          funcao?: string | null
          grupamento?: Database["public"]["Enums"]["grupamento_tipo"]
          id?: string
          membro_nome?: string
          ordem?: number
          promocao?: string | null
          rg?: string | null
          superior_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hierarquia_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hierarquia_superior_id_fkey"
            columns: ["superior_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cargo_id: string | null
          created_at: string
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          cargo_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          cargo_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_cargo_id_fkey"
            columns: ["cargo_id"]
            isOneToOne: false
            referencedRelation: "cargos"
            referencedColumns: ["id"]
          },
        ]
      }
      rsos: {
        Row: {
          acoes_setada: number | null
          aprovado_por: string | null
          armas_curtas: number | null
          armas_longas: number | null
          autor_email: string | null
          autor_nome: string
          bombas_caseiras: string | null
          caixa_eletronico: number | null
          chamados_190: number | null
          created_at: string
          data_ocorrencia: string
          descricao: string
          dinheiro_ilicito: string | null
          drogas: string | null
          encarregado_id: string | null
          guarnicao: string | null
          homem3_id: string | null
          homem4_id: string | null
          homem5_id: string | null
          id: string
          ilicito_bombas: number
          ilicito_cigarros: number
          ilicito_cocaina: number
          ilicito_dinheiro_marcado: number
          ilicito_ecstasy: number
          ilicito_fuzis: number
          ilicito_lockpicks: number
          ilicito_mun_fuzil: number
          ilicito_mun_pistola: number
          ilicito_mun_sub: number
          ilicito_pistolas: number
          ilicito_submetralhadoras: number
          local: string
          lockpicks: string | null
          motivo_rejeicao: string | null
          motorista_id: string | null
          multas_descricao: string | null
          municoes_curtas: string | null
          municoes_longas: string | null
          o11_disparo: number | null
          outras_ocorrencias: string | null
          outros_ilicitos: string | null
          patrulha_fim: string | null
          patrulha_inicio: string | null
          pinote_apoio: number | null
          prefixo_unidade: string | null
          prefixo_viatura: string | null
          prisoes_bopm: string | null
          responsavel_id: string | null
          roubo_caixa_registradora: number
          roubo_veiculo: number | null
          roubos_residencias: number | null
          status: string
          tipo: string | null
          trafico_drogas: number | null
          updated_at: string
        }
        Insert: {
          acoes_setada?: number | null
          aprovado_por?: string | null
          armas_curtas?: number | null
          armas_longas?: number | null
          autor_email?: string | null
          autor_nome: string
          bombas_caseiras?: string | null
          caixa_eletronico?: number | null
          chamados_190?: number | null
          created_at?: string
          data_ocorrencia: string
          descricao: string
          dinheiro_ilicito?: string | null
          drogas?: string | null
          encarregado_id?: string | null
          guarnicao?: string | null
          homem3_id?: string | null
          homem4_id?: string | null
          homem5_id?: string | null
          id?: string
          ilicito_bombas?: number
          ilicito_cigarros?: number
          ilicito_cocaina?: number
          ilicito_dinheiro_marcado?: number
          ilicito_ecstasy?: number
          ilicito_fuzis?: number
          ilicito_lockpicks?: number
          ilicito_mun_fuzil?: number
          ilicito_mun_pistola?: number
          ilicito_mun_sub?: number
          ilicito_pistolas?: number
          ilicito_submetralhadoras?: number
          local: string
          lockpicks?: string | null
          motivo_rejeicao?: string | null
          motorista_id?: string | null
          multas_descricao?: string | null
          municoes_curtas?: string | null
          municoes_longas?: string | null
          o11_disparo?: number | null
          outras_ocorrencias?: string | null
          outros_ilicitos?: string | null
          patrulha_fim?: string | null
          patrulha_inicio?: string | null
          pinote_apoio?: number | null
          prefixo_unidade?: string | null
          prefixo_viatura?: string | null
          prisoes_bopm?: string | null
          responsavel_id?: string | null
          roubo_caixa_registradora?: number
          roubo_veiculo?: number | null
          roubos_residencias?: number | null
          status?: string
          tipo?: string | null
          trafico_drogas?: number | null
          updated_at?: string
        }
        Update: {
          acoes_setada?: number | null
          aprovado_por?: string | null
          armas_curtas?: number | null
          armas_longas?: number | null
          autor_email?: string | null
          autor_nome?: string
          bombas_caseiras?: string | null
          caixa_eletronico?: number | null
          chamados_190?: number | null
          created_at?: string
          data_ocorrencia?: string
          descricao?: string
          dinheiro_ilicito?: string | null
          drogas?: string | null
          encarregado_id?: string | null
          guarnicao?: string | null
          homem3_id?: string | null
          homem4_id?: string | null
          homem5_id?: string | null
          id?: string
          ilicito_bombas?: number
          ilicito_cigarros?: number
          ilicito_cocaina?: number
          ilicito_dinheiro_marcado?: number
          ilicito_ecstasy?: number
          ilicito_fuzis?: number
          ilicito_lockpicks?: number
          ilicito_mun_fuzil?: number
          ilicito_mun_pistola?: number
          ilicito_mun_sub?: number
          ilicito_pistolas?: number
          ilicito_submetralhadoras?: number
          local?: string
          lockpicks?: string | null
          motivo_rejeicao?: string | null
          motorista_id?: string | null
          multas_descricao?: string | null
          municoes_curtas?: string | null
          municoes_longas?: string | null
          o11_disparo?: number | null
          outras_ocorrencias?: string | null
          outros_ilicitos?: string | null
          patrulha_fim?: string | null
          patrulha_inicio?: string | null
          pinote_apoio?: number | null
          prefixo_unidade?: string | null
          prefixo_viatura?: string | null
          prisoes_bopm?: string | null
          responsavel_id?: string | null
          roubo_caixa_registradora?: number
          roubo_veiculo?: number | null
          roubos_residencias?: number | null
          status?: string
          tipo?: string | null
          trafico_drogas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsos_encarregado_id_fkey"
            columns: ["encarregado_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsos_homem3_id_fkey"
            columns: ["homem3_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsos_homem4_id_fkey"
            columns: ["homem4_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsos_homem5_id_fkey"
            columns: ["homem5_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "hierarquia"
            referencedColumns: ["id"]
          },
        ]
      }
      timings: {
        Row: {
          created_at: string
          data: string
          entrada: string | null
          id: string
          saida: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data: string
          entrada?: string | null
          id?: string
          saida?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: string
          entrada?: string | null
          id?: string
          saida?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_rso_indicadores: { Args: never; Returns: Json }
      has_permission_or_admin: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      grupamento_tipo: "GERAL" | "TOR" | "ROCAM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      grupamento_tipo: ["GERAL", "TOR", "ROCAM"],
    },
  },
} as const
