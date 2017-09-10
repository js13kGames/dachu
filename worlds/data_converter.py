import sys

data = ""
if (len(sys.argv) <= 1):
	print("python csv to ascii converter")
	print("encodes binary into js readable data")
	print("by nes for js13kgames")
	print("python data_converter.py file.csv")
	sys.exit()
with open(sys.argv[1]) as fp:
	for line in fp:
		numbers = line.split(',')
		for number in numbers:
			data += (chr(int(number) + 36))
with open(sys.argv[1] + ".out", "w") as fw:
	fw.write(data)