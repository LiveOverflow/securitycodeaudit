const challenge = {
  code: `
def button1():
    correct()

def button2():
    wrong()
`,
  solve: {
    button1: () => {
      return true;
    },
    button2: () => {
      return false;
    },
    button3: (text: string) => {
      return text === "test";
    },
    button4: (param1: string, param2: string) => {
      return param1 === param2;
    },
  },
};

export default challenge;
