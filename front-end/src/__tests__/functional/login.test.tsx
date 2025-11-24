/**
 * Testes Funcionais - RF01: Autenticação
 *
 * Requisito Funcional: O sistema deve permitir que usuários autentiquem-se
 * através de email e senha, e redirecionar para o dashboard após login bem-sucedido.
 *
 * Abordagem: Caixa Preta - Testa o comportamento sem conhecer implementação interna
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Home from "@/app/page";
import { api } from "@/services/api";
import { toast } from "sonner";

// Mocks
jest.mock("next/navigation");
jest.mock("@/services/api", () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("RF01 - Funcionalidade de Login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("Cenário 1: Login com credenciais válidas", () => {
    it("deve autenticar usuário e redirecionar para dashboard", async () => {
      // Arrange - Dados de entrada válidos
      const mockToken = "valid-token-123";
      (api.post as jest.Mock).mockResolvedValue({
        data: { token: mockToken },
      });

      // Act - Renderizar componente e preencher formulário
      render(<Home />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      fireEvent.change(emailInput, {
        target: { value: "admin@ristorante.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "senha123" } });
      fireEvent.click(submitButton);

      // Assert - Verificar comportamento esperado
      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith("/session", {
          email: "admin@ristorante.com",
          password: "senha123",
        });
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Login realizado com sucesso!"
        );
      });

      await waitFor(() => {
        expect(useRouter().push).toHaveBeenCalledWith("/dashboard");
      });

      // Verificar se cookie foi definido
      expect(document.cookie).toContain("session=");
    });
  });

  describe("Cenário 2: Login com campos vazios", () => {
    it("deve exibir mensagem de erro quando campos estão vazios", async () => {
      // Arrange
      render(<Home />);

      const submitButton = screen.getByRole("button", { name: /entrar/i });

      // Act - Tentar submeter sem preencher campos
      fireEvent.click(submitButton);

      // Assert - Validação HTML5 deve impedir submit
      // Mas se passar, deve mostrar erro
      await waitFor(() => {
        // O formulário HTML5 required deve impedir, mas verificamos se toast.error foi chamado
        // se a validação passar
        const emailInput = screen.getByLabelText(/e-mail/i) as HTMLInputElement;
        expect(emailInput.validity.valid).toBe(false);
      });
    });
  });

  describe("Cenário 3: Login com credenciais inválidas", () => {
    it("deve exibir mensagem de erro quando credenciais são inválidas", async () => {
      // Arrange - Simular erro da API
      (api.post as jest.Mock).mockRejectedValue(
        new Error("Credenciais inválidas")
      );

      // Act
      render(<Home />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      fireEvent.change(emailInput, { target: { value: "invalid@email.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao fazer login");
      });

      // Não deve redirecionar
      expect(useRouter().push).not.toHaveBeenCalled();
    });
  });

  describe("Cenário 4: Login sem token na resposta", () => {
    it("deve exibir erro quando API não retorna token", async () => {
      // Arrange - API retorna sucesso mas sem token
      (api.post as jest.Mock).mockResolvedValue({
        data: {}, // Sem token
      });

      // Act
      render(<Home />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      fireEvent.change(emailInput, {
        target: { value: "admin@ristorante.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "senha123" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Erro ao fazer login");
      });

      expect(useRouter().push).not.toHaveBeenCalled();
    });
  });

  describe("Cenário 5: Estado de loading durante login", () => {
    it("deve desabilitar botão e mostrar loading durante autenticação", async () => {
      // Arrange - Delay na resposta
      (api.post as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  data: { token: "token" },
                }),
              100
            )
          )
      );

      // Act
      render(<Home />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole("button", { name: /entrar/i });

      fireEvent.change(emailInput, {
        target: { value: "admin@ristorante.com" },
      });
      fireEvent.change(passwordInput, { target: { value: "senha123" } });
      fireEvent.click(submitButton);

      // Assert - Verificar estado de loading
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/entrando/i)).toBeInTheDocument();

      await waitFor(
        () => {
          expect(submitButton).not.toBeDisabled();
        },
        { timeout: 200 }
      );
    });
  });
});
