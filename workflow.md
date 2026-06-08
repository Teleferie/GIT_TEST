# Dokumentacja Potoku CI/CD (GitHub Actions)

Plik konfiguracyjny `.github/workflows/ci-cd.yml` definiuje automatyczny proces integracji i wdrażania aplikacji.

## Triggery (Wyzwalacze)

| Wyzwalacz | Gałęzie | Opis |
| :--- | :--- | :--- |
| `push` | `main`, `develop` | Uruchamia pipeline przy każdym pushu do tych gałęzi. |
| `pull_request` | `main` | Uruchamia pipeline podczas otwarcia lub aktualizacji PR do gałęzi main. |

## Zmienne Środowiskowe (env)

* `ENVIRONMENT`: Dynamicznie ustawiana zmienna. Przyjmuje wartość `production` dla gałęzi `main`, w innych przypadkach `staging`.
* `BUILD_DIR`: Definiuje katalog wyjściowy dla skompilowanej aplikacji (`dist`).

## Architektura Jobów i Warunki

| Nazwa Jobu | Cel / Funkcjonalność | Warunki i Zależności |
| :--- | :--- | :--- |
| **Build Application** (`build`) | Kompilacja kodu źródłowego i przygotowanie paczki. | Uruchamia się zawsze na triggerze. Zawiera krok warunkowy `if`, który wypycha artefakty (`upload-artifact`) **tylko** gdy kod znajduje się na gałęzi `main`. |
| **Run Tests** (`test`) | Wykonanie testów automatycznych. | `needs: build` (wymaga sukcesu budowania). Posiada krok warunkowy uruchamiający głębokie testy integracyjne wyłącznie dla środowiska produkcyjnego. |
| **Deploy to prod** (`deploy`) | Wdrożenie aplikacji na produkcję. | `needs: test` oraz restrykcyjny warunek `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`. Gwarantuje to brak wdrożeń z PR-ów oraz innych gałęzi niż główna. |
| **Status Report** (`status_report`) | Agregacja wyników i czytelne raportowanie logów. | `needs: [build, test, deploy]` oraz warunek `if: always()`. Działa jako końcowa bramka informacyjna. |

---

## Uruchamianie lokalne z Dockerem (Opcjonalnie)

Aby przetestować ten workflow lokalnie bez ciągłego pushowania zmian na GitHub, można użyć narzędzia **act** (które uruchamia akcje wewnątrz kontenerów Docker).

### Wymagania wstępne:
1. Zainstalowany Docker Daemon.
2. Zainstalowane narzędzie `act` (np. przez `brew install act` lub `choco install act-cli`).

### Komendy do uruchomienia:

* **Symulacja zdarzenia Push na gałąź main:**
    ```bash
    act push -b main
    ```

* **Symulacja zdarzenia Pull Request:**
    ```bash
    act pull_request
    ```

* **Podgląd dostępnych jobów w pipeline:**
    ```bash
    act -l
    ```
