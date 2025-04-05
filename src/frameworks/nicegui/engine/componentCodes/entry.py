from tkinter import tk

class EntryWithPlaceholder(tk.Entry):
    def __init__(self, master=None, placeholder="placeholder", *args, **kwargs):
        super().__init__(master, *args, **kwargs)
