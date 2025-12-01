
# informace o fungování kódu níže brány z chatgpt, mohou být chybné
# jak kód vylepšit: příliš dlouhý text položky listboxu přeteče listbox horizontálně, přílišný počet položek vertikálně, položky listboxu jsou zdá se jen jednorážkové, zalomení v textu "\n" ignorující (při označení náhodné položky lze šipkami na klávesnici najet na přetečený obsah), šlo by asi nahradit listbox framem a do něj vkládat elementy, které zalomení umožní; dále by asi šel nastavit limit pro počet znaků v entry elementu (i aby vedlo uživatele k zadávání jednoduchých zapamatovatelných úloh); dále by možná šlo třídit položky podle důležitosti na tři barvy (otázka ovšem, zda je vůbec vhodné pro smysl to-do listu)


import tkinter as tk
import tkinter.font as tk_font
import json


def add(to_do):                                                                # to_do je string
 listbox_elm.insert(tk.END, to_do)                                             # tk.END tj. na konec seznamu

def delete(to_do):
 listbox_elm.delete(to_do)

def clear_to_do_item_selection(event):
 listbox_elm.selection_clear(0, tk.END)

def add_btn_click():
 entry_content = entry_elm.get()
 if entry_content:
   to_do = "• " + entry_content
   add(to_do)
   entry_elm.delete(0, tk.END)                                                 # smaže entry_elm content od nultého znaku včetně, tj. celý

def del_btn_click():
 selected = listbox_elm.curselection()
 if selected:
   delete(selected[0])
   if listbox_elm.size() > 0:
     listbox_elm.selection_set(0)                                              # po smazání automaticky označí první listbox item, je-li tu nějaký

def close():
 store_to_dos()
 app_window.destroy()

def store_to_dos():
 to_do_tuple = listbox_elm.get(0, tk.END)
 with open("data.json", mode="w", encoding="utf-8") as file_object:
   json.dump(to_do_tuple, file_object, ensure_ascii=False, indent=2)


app_window = tk.Tk()
app_window.title("to-do list")
app_window.protocol("WM_DELETE_WINDOW", close)                                 # klikne-li uživatel na křížek zavření okna aplikace, spustí se místo zavření funkce

pt = tk_font.nametofont("TkDefaultFont").measure("x")                          # příkaz musí být proveden až po příkazu "tk.Tk()"; počítá šířku znaku "x" defaultního fontu v pixelech; v tkinteru se snad rozměry obecně zadávají v pixelech, u některých elementů při zadávání jejich šířky/width a výšky/height ve znacích (např. Entry, Listbox) (prý je užita šířka průměrného znaku fontu, co nemusí vždy odpovídat šířce "x" ani prý často také užitého "n")


## vlastní nastavení ##
app_window.geometry(f"{pt*55}x{pt*50}")
top_elms_pady = 8                                                              # vertikální "y" padding mezi bezprostředně vnitnřími elementy okna aplikace (bezprostředně vnitřními a pod sebou jsoucími jsou element entry, element box obsahující buttony "add" a "del", element listbox s to-do itemy, tím, že je pady přidán prvnímu a třetímu, je mezi nimi všemi a nahoře a dole tatáž mezera)
entry_elm_padx = 20                                                            # horizontální "x" padding mezi entry elementem a oknem aplikace; čím větší, tím méně místa pro samotný entry element
box_elm_padx = entry_elm_padx                                                  # čím menší, tím jsou buttony add a del od sebe dálek (první jsa v boxu vlevo, druhý vpravo)
listbox_elm_padx = 5


entry_elm = tk.Entry(app_window)
entry_elm.pack(pady=top_elms_pady, padx=entry_elm_padx, fill="x")              # přibalí/pack entry element do okna aplikace, defaultně horizontálně zarovnaný doprostřed a vertikální nahoru, jako první, podle pořadí volání .pack() napříč elementy (bez volání pack by element v okně vůbec nebyl)
entry_elm.bind("<FocusIn>", clear_to_do_item_selection)                        # při FocusIn/aktivování elementu se spustí příslušná funkce (tj. je-li element aktivní, ruší aktivní označení položky listboxu)

box_elm = tk.Frame(app_window)
box_elm.pack(padx=box_elm_padx, fill="x")                                      # box (ve tvaru obdélníku), s horizontálním paddingem "padx", horizontálně vyplňující/fill dostupnou šířku (jinak by byl až na padding zkrácený na velikost svého obsahu)

listbox_elm = tk.Listbox(app_window, activestyle="none")                       # activestyle vybírá styl aktivní položky listu (defaultně se text podtrhne, co "none" vypíná)
listbox_elm.pack(pady=top_elms_pady, padx=listbox_elm_padx, expand=True, fill="both")    # díky expand=True získá element zbývající prostor v rodiči i vertikálně, ne jen horizontálně, díky fill "both" prostor také vyplní (alespoň podle zmatených informací z chatgpt)


add_elm = tk.Button(box_elm, text="add", command=add_btn_click)
add_elm.pack(side=tk.LEFT)                                                     # add button umístěný v boxu vlevo

del_elm = tk.Button(box_elm, text="del", command=del_btn_click)
del_elm.pack(side=tk.RIGHT)


with open("data.json", encoding="utf-8") as file_obj:
 to_do_list = json.load(file_obj)
 for to_do in to_do_list:
   add(to_do)


app_window.mainloop()                                                          # spouští smyčku aplikace







