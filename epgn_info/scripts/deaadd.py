from matplotlib import pyplot as plt

Epoch = range(1, 6)
loss = [0.4201, 0.1665, 0.0992, 0.0830, 0.0676]
acc = [0.7948, 0.9229, 0.9520, 0.9577, 0.9655]

plt.plot(Epoch, loss, marker='o', mec='r', mfc='w', label='Loss')
plt.plot(Epoch, acc, marker='*', ms=10, label='Accuracy')
plt.legend()
plt.xlabel('Epoch')
plt.savefig("/home/pysuper/Pictures/plt.png")
plt.show()
