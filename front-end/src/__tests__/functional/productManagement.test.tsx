/**
 * Testes Funcionais - RF03: Gerenciamento de Produtos
 *
 * Requisito Funcional: O sistema deve permitir criar, editar e listar produtos
 * do cardápio, associando-os a categorias.
 *
 * Abordagem: Caixa Preta - Testa comportamento completo do formulário de produtos
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ProductForm } from "@/components/forms/ProductForm";
import { api } from "@/services/api";

// Mocks
jest.mock("@/services/api");

const mockApi = api as jest.Mocked<typeof api>;

describe("RF03 - Funcionalidade de Gerenciamento de Produtos", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock de categorias - axios retorna { data: [...] }, então mockamos assim
    mockApi.get.mockResolvedValue({
      data: [
        { id: "1", name: "Bebidas", created_at: "2024-01-01" },
        { id: "2", name: "Pratos", created_at: "2024-01-01" },
      ],
    } as any);
  });

  describe("Cenário 1: Criar produto com dados válidos", () => {
    it("deve criar produto e exibir mensagem de sucesso", async () => {
      // Arrange
      mockApi.post.mockResolvedValue({ data: { id: "1" } } as any);

      // Act
      render(<ProductForm />);

      // Aguardar carregamento de categorias
      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      // Preencher formulário
      const nameInput = screen.getByLabelText(/nome do produto/i);
      const priceInput = screen.getByLabelText(/preço/i);
      const descriptionInput = screen.getByLabelText(/descrição/i);
      const categorySelect = screen.getByLabelText(/categoria/i);
      const submitButton = screen.getByRole("button", {
        name: /criar produto/i,
      });

      fireEvent.change(nameInput, { target: { value: "Pizza Margherita" } });
      fireEvent.change(priceInput, { target: { value: "29.90" } });
      fireEvent.change(descriptionInput, {
        target: { value: "Pizza tradicional italiana" },
      });
      fireEvent.change(categorySelect, { target: { value: "2" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith("/products", {
          name: "Pizza Margherita",
          price: "29.90",
          description: "Pizza tradicional italiana",
          banner: "",
          category_id: "2",
        });
      });

      await waitFor(() => {
        expect(
          screen.getByText(/produto criado com sucesso/i)
        ).toBeInTheDocument();
      });

      // Verificar se formulário foi limpo
      expect(nameInput).toHaveValue("");
    });
  });

  describe("Cenário 2: Validação de campos obrigatórios", () => {
    it("deve exibir erro quando nome está vazio", async () => {
      // Arrange
      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      // Act - Tentar submeter sem preencher nome
      const form = screen
        .getByRole("button", {
          name: /criar produto/i,
        })
        .closest("form");

      if (form) {
        fireEvent.submit(form);
      } else {
        const submitButton = screen.getByRole("button", {
          name: /criar produto/i,
        });
        fireEvent.click(submitButton);
      }

      // Assert
      await waitFor(
        () => {
          expect(
            screen.getByText(/nome do produto é obrigatório/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(mockApi.post).not.toHaveBeenCalled();
    });

    it("deve exibir erro quando preço está vazio", async () => {
      // Arrange
      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      // Act
      const nameInput = screen.getByLabelText(/nome do produto/i);
      const submitButton = screen.getByRole("button", {
        name: /criar produto/i,
      });

      fireEvent.change(nameInput, { target: { value: "Produto Teste" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/preço do produto é obrigatório/i)
        ).toBeInTheDocument();
      });
    });

    it("deve exibir erro quando categoria não é selecionada", async () => {
      // Arrange
      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      // Act
      const nameInput = screen.getByLabelText(/nome do produto/i);
      const priceInput = screen.getByLabelText(/preço/i);
      const descriptionInput = screen.getByLabelText(/descrição/i);
      const submitButton = screen.getByRole("button", {
        name: /criar produto/i,
      });

      fireEvent.change(nameInput, { target: { value: "Produto Teste" } });
      fireEvent.change(priceInput, { target: { value: "10.00" } });
      fireEvent.change(descriptionInput, {
        target: { value: "Descrição teste" },
      });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/categoria do produto é obrigatória/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cenário 3: Erro ao criar produto", () => {
    it("deve exibir mensagem de erro quando API falha", async () => {
      // Arrange
      mockApi.post.mockRejectedValue(new Error("Erro ao criar produto"));

      // Act
      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome do produto/i);
      const priceInput = screen.getByLabelText(/preço/i);
      const descriptionInput = screen.getByLabelText(/descrição/i);
      const categorySelect = screen.getByLabelText(/categoria/i);
      const submitButton = screen.getByRole("button", {
        name: /criar produto/i,
      });

      fireEvent.change(nameInput, { target: { value: "Produto Teste" } });
      fireEvent.change(priceInput, { target: { value: "10.00" } });
      fireEvent.change(descriptionInput, { target: { value: "Descrição" } });
      fireEvent.change(categorySelect, { target: { value: "1" } });
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/erro ao criar produto/i)).toBeInTheDocument();
      });
    });
  });

  describe("Cenário 4: Estado de loading", () => {
    it("deve desabilitar campos durante criação", async () => {
      // Arrange
      mockApi.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: {} } as any), 100)
          )
      );

      // Act
      render(<ProductForm />);

      await waitFor(() => {
        expect(screen.getByText(/criar produto/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/nome do produto/i);
      const priceInput = screen.getByLabelText(/preço/i);
      const descriptionInput = screen.getByLabelText(/descrição/i);
      const categorySelect = screen.getByLabelText(/categoria/i);
      const submitButton = screen.getByRole("button", {
        name: /criar produto/i,
      });

      fireEvent.change(nameInput, { target: { value: "Produto Teste" } });
      fireEvent.change(priceInput, { target: { value: "10.00" } });
      fireEvent.change(descriptionInput, { target: { value: "Descrição" } });
      fireEvent.change(categorySelect, { target: { value: "1" } });
      fireEvent.click(submitButton);

      // Assert
      expect(submitButton).toBeDisabled();
      expect(nameInput).toBeDisabled();
      expect(priceInput).toBeDisabled();
      expect(descriptionInput).toBeDisabled();
      expect(categorySelect).toBeDisabled();
    });
  });

  describe("Cenário 5: Carregamento de categorias", () => {
    it("deve carregar e exibir categorias no select", async () => {
      // Arrange
      mockApi.get.mockResolvedValue({
        data: [
          { id: "1", name: "Bebidas", created_at: "2024-01-01" },
          { id: "2", name: "Pratos", created_at: "2024-01-01" },
        ],
      } as any);

      // Act
      render(<ProductForm />);

      // Assert
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith("/categories");
      });

      await waitFor(() => {
        const categorySelect = screen.getByLabelText(/categoria/i);
        expect(categorySelect).toBeInTheDocument();
        expect(screen.getByText(/bebidas/i)).toBeInTheDocument();
        expect(screen.getByText(/pratos/i)).toBeInTheDocument();
      });
    });

    it("deve exibir erro quando falha ao carregar categorias", async () => {
      // Arrange
      mockApi.get.mockRejectedValue(new Error("Erro ao carregar"));

      // Act
      render(<ProductForm />);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(/erro ao carregar categorias/i)
        ).toBeInTheDocument();
      });
    });
  });
});
