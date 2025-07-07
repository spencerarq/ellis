import pytest
import os
import importlib


@pytest.mark.unit
def test_database_url_is_mandatory(monkeypatch):
    """
    Testa se a aplicação levanta um EnvironmentError quando a DATABASE_URL não está definida.
    """
    # Remove a variável de ambiente para simular o cenário de erro
    monkeypatch.delenv("DATABASE_URL", raising=False)

    # Importa o módulo que queremos testar
    from api import database

    # Como o módulo já pode ter sido importado, nós o recarregamos para
    # que o código no nível do módulo seja executado novamente.
    with pytest.raises(EnvironmentError) as excinfo:
        importlib.reload(database)

    # Verifica se a mensagem de erro é a esperada
    assert "A variável de ambiente DATABASE_URL é obrigatória" in str(excinfo.value)