import sys

bdata = bytearray()
data = ""
if (len(sys.argv) <= 1):
	print("python binary to csv converter")
	print("encodes binary into csv for data converter")
	print("by nes for js13kgames")
	print("python bin2csv.py file")
	sys.exit()
with open(sys.argv[1], "rb") as fp:
	byte = fp.read(1)
	while byte:
		bdata.append(byte[0])
		byte = fp.read(1)
data = ",".join(map(str, bdata))
with open(sys.argv[1] + ".out", "w") as fw:
	fw.write(data)