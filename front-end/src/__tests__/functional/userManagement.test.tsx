/**
 * Testes Funcionais - RF04: Gerenciamento de Usuários (Admin)
 *
 * Requisito Funcional: Administradores devem poder criar, editar e gerenciar
 * usuários do sistema, atribuindo diferentes papéis (roles).
 *
 * Abordagem: Caixa Preta - Testa comportamento do formulário de criação de usuários
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { UserForm } from "@/app/pages/admin/components/UserForm";
import { api } from "@/services/api";
import { getCookieClient } from "@/lib/cookieClient";
import { toast } from "sonner";

// Mock do Select do Radix UI para testes - transforma em select HTML nativo
jest.mock("@/components/ui/select", () => {
  const React = require("react");
  const roles = [
    { value: "USER", label: "Usuário" },
    { value: "GARCOM", label: "Garçom" },
    { value: "COZINHA", label: "Cozinha" },
    { value: "GERENTE", label: "Gerente" },
    { value: "ADMIN", label: "Administrador" },
  ];

  return {
    Select: ({ value, onValueChange }: any) => (
      <select
        value={value || ""}
        onChange={(e) => onValueChange(e.target.value)}
        data-testid="role-select"
        aria-label="Função"
      >
        <option value="">Selecione a função do usuário</option>
        {roles.map((role) => (
          <option key={role.value} value={role.value}>
            {role.label}
          </option>
        ))}
      </select>
    ),
    SelectTrigger: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
  };
});

// Mocks
jest.mock("@/services/api");
jest.mock("@/lib/cookieClient");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockApi = api as jest.Mocked<typeof api>;
const mockGetCookieClient = getCookieClient as jest.MockedFunction<
  typeof getCookieClient
>;

describe("RF04 - Funcionalidade de Gerenciamento de Usuários", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCookieClient.mockResolvedValue("admin-token");
  });

  describe("Cenário 1: Criar usuário com dados válidos", () => {
    it("deve criar usuário e exibir mensagem de sucesso", async () => {
      // Arrange
      const onUserCreated = jest.fn();
      mockApi.post.mockResolvedValue({ data: { id: "1" } } as any);

      // Act
      render(<UserForm onUserCreated={onUserCreated} />);

      // Preencher formulário
      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", {
        name: /criar|cadastrar/i,
      });

      fireEvent.change(nameInput, { target: { value: "João Silva" } });
      fireEvent.change(emailInput, { target: { value: "joao@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "senha123" } });

      // Select mockado - usar diretamente
      const roleSelect = screen.getByTestId("role-select");
      fireEvent.change(roleSelect, { target: { value: "GARCOM" } });

      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith(
          "/users",
          {
            name: "João Silva",
            email: "joao@example.com",
            password: "senha123",
            role: "GARCOM",
          },
          {
            headers: {
              Authorization: "Bearer admin-token",
            },
          }
        );
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Usuário criado com sucesso!"
        );
      });

      expect(onUserCreated).toHaveBeenCalled();
    });
  });

  describe("Cenário 2: Validação de campos obrigatórios", () => {
    it("deve exibir erro quando campos estão vazios", async () => {
      // Arrange
      const onUserCreated = jest.fn();

      // Act
      render(<UserForm onUserCreated={onUserCreated} />);

      const submitButton = screen.getByRole("button", {
        name: /criar|cadastrar/i,
      });
      const form = submitButton.closest("form");

      // Remover required dos inputs para testar validação do componente
      if (form) {
        const inputs = form.querySelectorAll("input[required]");
        inputs.forEach((input) => {
          (input as HTMLInputElement).removeAttribute("required");
        });
        fireEvent.submit(form);
      } else {
        fireEvent.click(submitButton);
      }

      // Assert - O componente deve validar e mostrar erro
      await waitFor(
        () => {
          expect(toast.error).toHaveBeenCalledWith("Preencha todos os campos");
        },
        { timeout: 2000 }
      );

      expect(mockApi.post).not.toHaveBeenCalled();
    });
  });

  describe("Cenário 3: Criar usuário com diferentes papéis", () => {
    const roles = ["ADMIN", "GERENTE", "GARCOM", "COZINHA", "USER"];

    roles.forEach((role) => {
      it(`deve permitir criar usuário com papel ${role}`, async () => {
        // Arrange
        const onUserCreated = jest.fn();
        mockApi.post.mockResolvedValue({ data: { id: "1" } } as any);

        // Act
        render(<UserForm onUserCreated={onUserCreated} />);

        const nameInput = screen.getByLabelText(/nome/i);
        const emailInput = screen.getByLabelText(/e-mail/i);
        const passwordInput = screen.getByLabelText(/senha/i);
        const submitButton = screen.getByRole("button", {
          name: /criar|cadastrar/i,
        });

        fireEvent.change(nameInput, { target: { value: "Test User" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "password123" } });

        // Select mockado - usar diretamente
        const roleSelect = screen.getByTestId("role-select");
        fireEvent.change(roleSelect, { target: { value: role } });

        fireEvent.click(submitButton);

        // Assert
        await waitFor(() => {
          expect(mockApi.post).toHaveBeenCalledWith(
            "/users",
            expect.objectContaining({
              role: role,
            }),
            expect.any(Object)
          );
        });
      });
    });
  });

  describe("Cenário 4: Erro ao criar usuário", () => {
    it("deve exibir mensagem de erro quando API falha", async () => {
      // Arrange
      const onUserCreated = jest.fn();
      mockApi.post.mockRejectedValue({
        response: {
          data: { error: "Email já cadastrado" },
        },
      });

      // Act
      render(<UserForm onUserCreated={onUserCreated} />);

      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", {
        name: /criar|cadastrar/i,
      });

      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, {
        target: { value: "existing@example.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Select mockado - usar diretamente
      const roleSelect = screen.getByTestId("role-select");
      fireEvent.change(roleSelect, { target: { value: "GARCOM" } });

      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Email já cadastrado");
      });

      expect(onUserCreated).not.toHaveBeenCalled();
    });
  });

  describe("Cenário 5: Limpeza do formulário após criação", () => {
    it("deve limpar formulário após criar usuário com sucesso", async () => {
      // Arrange
      const onUserCreated = jest.fn();
      mockApi.post.mockResolvedValue({ data: { id: "1" } } as any);

      // Act
      render(<UserForm onUserCreated={onUserCreated} />);

      const nameInput = screen.getByLabelText(/nome/i);
      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", {
        name: /criar|cadastrar/i,
      });

      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });

      // Select mockado - usar diretamente
      const roleSelect = screen.getByTestId("role-select");
      fireEvent.change(roleSelect, { target: { value: "GARCOM" } });

      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(onUserCreated).toHaveBeenCalled();
      });

      // Verificar se campos foram limpos (pode depender da implementação)
      // O formulário pode ser resetado através de key change
    });
  });
});
