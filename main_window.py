import sys
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from web3_api import *
import pyperclip


class App(QMainWindow):
    def __init__(self):
        super().__init__()

        self.title = 'Party Coin'
        self.left = 0
        self.top = 0
        self.width = 300
        self.height = 200
        self.setWindowTitle(self.title)
        self.setGeometry(self.left, self.top, self.width, self.height)

        self.table_widget = MyTableWidget(self)
        self.setCentralWidget(self.table_widget)

        self.show()


class MyTableWidget(QWidget):

    def __init__(self, parent):
        super(QWidget, self).__init__(parent)
        self.layout = QVBoxLayout(self)
        # Initialize tab screen
        self.tabs = QTabWidget()
        self.general_tab = QWidget()
        self.send_tab = QWidget()
        self.receive_tab = QWidget()
        self.tabs.resize(300, 200)

        self.boldFont = QFont()
        self.boldFont.setBold(True)

        # Add tabs
        self.tabs.addTab(self.general_tab, "General")
        self.tabs.addTab(self.send_tab, "Send")
        self.tabs.addTab(self.receive_tab, "Receive")

        self.create_general_tab()
        self.create_send_tab()
        self.create_receive_tab()

        # Add tabs to widget
        self.layout.addWidget(self.tabs)
        self.setLayout(self.layout)
        self.layout.setAlignment(Qt.AlignTop)

    def on_click_send(self):
        address = self.address_to_box.text()
        amount = int(self.send_amount_box.text())
        send_pty(address[2:], amount)

    def create_send_tab(self):
        self.send_tab.layout = QVBoxLayout(self)
        self.address_to_label = QLabel(self)
        self.address_to_label.setText("Recepient Address: ")
        self.address_to_box = QLineEdit(self)

        self.amount_label = QLabel(self)
        self.amount_label.setText("Amount: ")
        self.send_amount_box = QLineEdit(self)
        self.onlyInt = QIntValidator()
        self.send_amount_box.setValidator(self.onlyInt)

        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self.on_click_send)

        self.send_tab.layout.addWidget(self.address_to_label)
        self.send_tab.layout.addWidget(self.address_to_box)
        self.send_tab.layout.addWidget(self.amount_label)
        self.send_tab.layout.addWidget(self.send_amount_box)
        self.send_tab.layout.addWidget(self.send_button)
        self.send_tab.setLayout(self.send_tab.layout)

    def on_click_copy(self):
        pyperclip.copy(self.receive_address_box.text())

    def create_receive_tab(self):
        self.receive_tab.layout = QVBoxLayout(self)

        self.receive_address_box_label = QLabel(self)
        self.receive_address_box_label.setText("Address:")
        self.receive_address_box = QLineEdit(self)
        self.receive_address_box.setDisabled(True)
        self.receive_address_box.setText(get_own_address())

        self.copy_receive_address_button = QPushButton("Copy")
        self.copy_receive_address_button.clicked.connect(self.on_click_copy)

        self.receive_tab.layout.addWidget(self.receive_address_box_label)
        self.receive_tab.layout.addWidget(self.receive_address_box)
        self.receive_tab.layout.addWidget(self.copy_receive_address_button)
        self.receive_tab.layout.setAlignment(Qt.AlignTop)
        self.receive_tab.setLayout(self.receive_tab.layout)

    def create_general_tab(self):
        self.general_tab.layout = QVBoxLayout(self)

        self.balance_label = QLabel(self)
        self.balance_label.setText("Balance: ")
        self.balance_box = QLabel(self)
        self.balance_box.setFont(self.boldFont)
        self.balance_box.setText(str(get_balance()))

        self.general_tab.layout.addWidget(self.balance_label)
        self.general_tab.layout.addWidget(self.balance_box)
        self.general_tab.layout.setAlignment(Qt.AlignTop)
        self.general_tab.setLayout(self.general_tab.layout)

    @pyqtSlot()
    def on_click(self):
        print("\n")
        for currentQTableWidgetItem in self.tableWidget.selectedItems():
            print(currentQTableWidgetItem.row(), currentQTableWidgetItem.column(), currentQTableWidgetItem.text())


if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = App()
    sys.exit(app.exec_())
