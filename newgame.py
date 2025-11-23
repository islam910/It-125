import random
import pygame

class Cell:
    def __init__(self):
        self.is_mine = False
        self.is_open = False
        self.is_flagged = False
        self.adjacent_mines = 0


class Gameboard:
    def __init__(self, width, height, mines_count):
        self.width = width
        self.height = height
        self.mines_count = mines_count
        self.game_over = False
        self.victory = False

        self.board = [[Cell() for _ in range(width)] for _ in range(height)]
        self.place_mines()
        self._calculate_adjacent_mines()

    def place_mines(self):
        all_coords = [(r, c) for r in range(self.height) for c in range(self.width)]
        mine_coords = random.sample(all_coords, self.mines_count)

        for r, c in mine_coords:
            self.board[r][c].is_mine = True

    def _calculate_adjacent_mines(self):
        for r in range(self.height):
            for c in range(self.width):
                if self.board[r][c].is_mine:
                    continue

                mine_count = 0
                for dr in [-1, 0, 1]:
                    for dc in [-1, 0, 1]:
                        if dr == 0 and dc == 0:
                            continue

                        nr, nc = r + dr, c + dc
                        if 0 <= nr < self.height and 0 <= nc < self.width:
                            if self.board[nr][nc].is_mine:
                                mine_count += 1

                self.board[r][c].adjacent_mines = mine_count

    def open_cell(self, r, c):
        if self.game_over or self.victory:
            return

        cell = self.board[r][c]

        if cell.is_open or cell.is_flagged:
            return

        if cell.is_mine:
            cell.is_open = True
            self.game_over = True
            return

        cell.is_open = True
        self.check_victory()

        if cell.adjacent_mines == 0:
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    if dr == 0 and dc == 0:
                        continue

                    nr, nc = r + dr, c + dc
                    if 0 <= nr < self.height and 0 <= nc < self.width:
                        self.open_cell(nr, nc)

    def toggle_flag(self, r, c):
        if self.game_over or self.victory:
            return

        cell = self.board[r][c]
        if not cell.is_open:
            cell.is_flagged = not cell.is_flagged

    def check_victory(self):
        """Победа = открыты все клетки без мин"""
        for r in range(self.height):
            for c in range(self.width):
                cell = self.board[r][c]
                if not cell.is_mine and not cell.is_open:
                    return  

        self.victory = True



BOARD_WIDTH = 20
BOARD_HEIGHT = 20
MINES_COUNT = 30

CELL_SIZE = 30
SCREEN_WIDTH = BOARD_WIDTH * CELL_SIZE
SCREEN_HEIGHT = BOARD_HEIGHT * CELL_SIZE

BG_COLOR = (192, 192, 192)
LINE_COLOR = (128, 128, 128)

pygame.init()
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Сапер")

font = pygame.font.SysFont('Arial', CELL_SIZE // 2)

def new_game():
    return Gameboard(BOARD_WIDTH, BOARD_HEIGHT, MINES_COUNT)

Game_Board = new_game()


def draw_board(board_obj):
    screen.fill(BG_COLOR)

    for r in range(board_obj.height):
        for c in range(board_obj.width):
            cell = board_obj.board[r][c]
            x = c * CELL_SIZE
            y = r * CELL_SIZE
            rect = pygame.Rect(x, y, CELL_SIZE, CELL_SIZE)

            pygame.draw.rect(screen, LINE_COLOR, rect, 1)

            if cell.is_open:
                if cell.is_mine:
                    pygame.draw.circle(screen, (255, 0, 0), rect.center, CELL_SIZE // 3)
                elif cell.adjacent_mines > 0:
                    text = font.render(str(cell.adjacent_mines), True, (0, 0, 0))
                    screen.blit(text, text.get_rect(center=rect.center))

            elif cell.is_flagged:
                pygame.draw.polygon(screen, (255, 255, 0),
                                    [(rect.left + 5, rect.top + 5),
                                     (rect.right - 5, rect.centery),
                                     (rect.left + 5, rect.bottom - 5)])


running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN and not (Game_Board.game_over or Game_Board.victory):
            x, y = event.pos
            c = x // CELL_SIZE
            r = y // CELL_SIZE

            if event.button == 1:
                Game_Board.open_cell(r, c)
            elif event.button == 3:
                Game_Board.toggle_flag(r, c)

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r:
                Game_Board = new_game()

    draw_board(Game_Board)

    if Game_Board.game_over:
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 150))
        screen.blit(overlay, (0, 0))

        text = font.render("Вы проиграли! Нажмите R", True, (255, 255, 255))
        screen.blit(text, text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2)))

    if Game_Board.victory:
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 255, 0, 120))
        screen.blit(overlay, (0, 0))

        text = font.render("Победа! Нажмите R", True, (0, 0, 0))
        screen.blit(text, text.get_rect(center=(SCREEN_WIDTH//2, SCREEN_HEIGHT//2)))

    pygame.display.flip()

pygame.quit()
