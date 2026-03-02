# app.py
import tkinter as tk
from tkinter import filedialog
from preprocess import load_dataset, preprocess_dataset
from model import create_cnn, save_cnn, load_cnn
from train import train_cnn, evaluate_cnn, train_cnn_rf, train_cnn_svm, train_random_forest, train_svm
from utils import plot_comparison_graph

# Tkinter GUI
main = tk.Tk()
main.title("Electricity Theft Detection")
main.geometry("1000x650")

cnn_model = None
classifier = None
X, Y = None, None

# Functions for buttons
def uploadDataset():
    global X, Y, filename
    filename = filedialog.askopenfilename(initialdir="Dataset")
    text.delete('1.0', tk.END)
    text.insert(tk.END, filename + " Loaded\n")
    dataset = load_dataset(filename)
    text.insert(tk.END, str(dataset.head()) + "\n\n")
    X, Y = preprocess_dataset(dataset)

def runCNNModel():
    global cnn_model
    cnn_model = create_cnn(X.shape[1], len(set(Y)))
    train_cnn(cnn_model, X, Y)
    save_cnn(cnn_model)
    a, p, r, f = evaluate_cnn(cnn_model, X, Y)
    text.insert(tk.END, f"CNN Accuracy: {a}\nPrecision: {p}\nRecall: {r}\nF1: {f}\n\n")

def runCNNRFModel():
    global classifier
    classifier, a, p, r, f = train_cnn_rf(cnn_model, X, Y)
    text.insert(tk.END, f"CNN-RF Accuracy: {a}\nPrecision: {p}\nRecall: {r}\nF1: {f}\n\n")

def runCNNSVMModel():
    global classifier
    classifier, a, p, r, f = train_cnn_svm(cnn_model, X, Y)
    text.insert(tk.END, f"CNN-SVM Accuracy: {a}\nPrecision: {p}\nRecall: {r}\nF1: {f}\n\n")

def runRF():
    global classifier
    classifier, a, p, r, f = train_random_forest(X, Y)
    text.insert(tk.END, f"Random Forest Accuracy: {a}\nPrecision: {p}\nRecall: {r}\nF1: {f}\n\n")

def runSVMModel():
    global classifier
    classifier, a, p, r, f = train_svm(X, Y)
    text.insert(tk.END, f"SVM Accuracy: {a}\nPrecision: {p}\nRecall: {r}\nF1: {f}\n\n")

def showGraph():
    plot_comparison_graph()

# GUI Layout
font1 = ('times', 13, 'bold')
buttons = [
    ("Upload Dataset", uploadDataset),
    ("Run CNN", runCNNModel),
    ("CNN+RF", runCNNRFModel),
    ("CNN+SVM", runCNNSVMModel),
    ("Random Forest", runRF),
    ("SVM", runSVMModel),
    ("Comparison Graph", showGraph)
]

x_pos = 50
y_pos = 50
for text_btn, func in buttons:
    tk.Button(main, text=text_btn, command=func, font=font1).place(x=x_pos, y=y_pos)
    x_pos += 250
    if x_pos > 750:
        x_pos = 50
        y_pos += 50

text = tk.Text(main, height=20, width=120)
text.place(x=10, y=300)

main.mainloop()
