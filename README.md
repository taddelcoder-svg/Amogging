# Verräter an Bord

Online-Partyspiel im Stil von „Among Us“ für Familie und Freunde, direkt im Browser (PC, Tablet, Handy).

## Spielen

- **Raum erstellen:** Name eingeben, „Neuen Raum erstellen“. Du bekommst einen Code aus 4 Buchstaben und einen Link zum Teilen.
- **Beitreten:** Code eingeben oder den Link öffnen. Bis zu 12 Spieler, ab 4 geht es los. Fehlende Mitspieler füllt der Gastgeber mit **Bots** auf.
- **Crew:** Erledigt Aufgaben auf dem Raumschiff (Kabel verbinden, Zahlen drücken, Daten laden, Tanken, Karte durchziehen, Kalibrieren, Asteroiden abschießen, Körperscan) und findet heraus, wer der Verräter ist.
- **Verräter:** Töten, durch Lüftungsschächte kriechen und sabotieren (Licht aus, Reaktor-Kernschmelze).
- **Besprechung:** Leiche melden oder den Notfallknopf in der Kantine drücken, im Chat diskutieren, abstimmen. Tote spielen als Geister weiter, machen Aufgaben und haben einen eigenen Geister-Chat.
- **Sieg:** Die Crew gewinnt, wenn alle Aufgaben erledigt oder alle Verräter rausgeworfen sind. Die Verräter gewinnen, wenn sie gleich viele sind wie die Crew oder der Reaktor durchbrennt.
- **Einstellungen (Gastgeber):** Anzahl Verräter, Abklingzeit fürs Töten, Aufgaben pro Person, Diskussions- und Abstimmzeit, Rolle beim Rauswurf zeigen.

### Steuerung

- **Tastatur:** WASD oder Pfeiltasten laufen, E benutzen, R melden, Q töten, V Schacht, F Sabotage, M Karte
- **Touch:** irgendwo hintippen und ziehen zum Laufen, Aktionsknöpfe unten rechts

Wer kurz die Verbindung verliert (z. B. Handy gesperrt), kommt im selben Tab automatisch zurück ins laufende Spiel.

## Lokal starten

```bash
npm install
npm start
```

Dann http://localhost:10000 öffnen. Für Mitspieler im selben WLAN die IP-Adresse des Rechners verwenden, z. B. `http://192.168.0.20:10000`.

## Deployment (z. B. Render)

Das `Dockerfile` startet den Server auf `$PORT`. Es wird keine Datenbank gebraucht: Räume liegen nur im Arbeitsspeicher und sind nach einem Neustart weg.

## Aufbau

- `spiel.js`: Spiellogik auf dem Server (Räume, Karte, Rollen, Aufgaben, Töten, Schächte, Sabotage, Abstimmung, Bots), WebSocket unter `/ws`
- `server.js`: liefert die Seite aus und leitet `/ws` an das Spiel weiter
- `public/index.html`: der komplette Client (Canvas-Grafik, Minispiele, Lobby, Besprechung)
- `public/vendor/`: Schrift Barlow Semi Condensed (SIL Open Font License, siehe `OFL-Barlow.txt`)
