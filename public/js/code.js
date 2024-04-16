let database = "Loudon"; //To set Loudon database by default

let btn_theme = document.getElementById('dark_mode_btn'); //To check the actual theme

//Allow to swap between database and update the interface accordingly

function change_database_bilbao(){

  let btn_b = document.getElementById("db_btn_B"); 
  let btn_l = document.getElementById("db_btn_L");  

  btn_b.classList.add('is-active');
  btn_l.classList.remove('is-active');

  database = "Bilbao"

}

function change_database_loudon(){

  let btn_b = document.getElementById("db_btn_B"); 
  let btn_l = document.getElementById("db_btn_L");   

  btn_l.classList.add('is-active');
  btn_b.classList.remove('is-active');

  database = "Loudon"
  
}


//Allow to open the database
async function getData(name) {
  return promise = axios.get(`../db/Point_Group_${database}/${name}`)
  .then(function (response) {
    databaseJson = response.data;
    Promise.resolve(response.data)
  })
  .catch(function (error) {
    window.alert("This point group is not found!");
});
}


//Function called when « Calculate » button is pressed
//Extract interface value from html and the api (and therefore launch python program) and update table
async function calcul() {

    await check_spaceg_select(database)

    let pointing_vector_x
    let pointing_vector_y 
    let pointing_vector_z

    let ref_axis_x
    let ref_axis_y
    let ref_axis_z

    let space_group = document.getElementById("spaceg");
    space_group= space_group.options[space_group.selectedIndex].value;

    let pointing_vector = document.getElementById("pointing_vector");
    
    if (pointing_vector.options[pointing_vector.selectedIndex].value == 'Other') {
      let pointing_vector_xg = document.getElementById("point-vector-x")
      pointing_vector_x = pointing_vector_xg.value;
  
      let pointing_vector_yg = document.getElementById("point-vector-y")
      pointing_vector_y = pointing_vector_yg.value;
  
      let pointing_vector_zg = document.getElementById("point-vector-z")
      pointing_vector_z = pointing_vector_zg.value;
      
    }
 
  
    pointing_vector = pointing_vector.options[pointing_vector.selectedIndex].value;

    let ref_axis = document.getElementById("ref_axis");
    if (ref_axis.options[ref_axis.selectedIndex].value == 'Other') {
    let ref_axis_xg = document.getElementById("ref-axis-x")
    ref_axis_x = ref_axis_xg.value

    let ref_axis_yg = document.getElementById("ref-axis-y")
    ref_axis_y = ref_axis_yg.value

    let ref_axis_zg = document.getElementById("ref-axis-z")
    ref_axis_z = ref_axis_zg.value
    }
   
    ref_axis = ref_axis.options[ref_axis.selectedIndex].value;

    let polar_in = document.getElementById("polar_inc");
    polar_in = polar_in.options[polar_in.selectedIndex].value;

    let polar_out = document.getElementById("polar_out");
    polar_out = polar_out.options[polar_out.selectedIndex].value;

    let angle = document.getElementById("angle")
    angle = angle.value;

    const promise1 = axios.get(`api?space_group=${space_group}&pointing_vector=${pointing_vector}&ref_axis=${ref_axis}&polar_in=${polar_in}&polar_out=${polar_out}&angle=${angle}&pointing_vector_x=${pointing_vector_x}&pointing_vector_y=${pointing_vector_y}&pointing_vector_z=${pointing_vector_z}&ref_axis_x=${ref_axis_x}&ref_axis_y=${ref_axis_y}&ref_axis_z=${ref_axis_z}&database=${database}`,
    ).then(function (response) {
      
      if(response.data[1] == "true") {

        window.alert("The Pointing vector is not perpendicular to polarization ! \n\nPlease change pointing vector or your reference axis");
      }
      
      else if(response.data[0] == "sg") {

        window.alert("The space group is not defined !");

      }

      else if(response.data[0] == "pv") {

        window.alert("This pointing vector is not allowed !");

      }

      else if(response.data[0] == "refaxis") {

        window.alert("This reference axis is not allowed !");

      }

      else if(response.data[0] == "polar_in") {

        window.alert("This incident polarisation is not allowed !");

      }

      else if(response.data[0] == "polar_out") {

        window.alert("This collection polarisation is not allowed !");

      }

      else if(response.data[0] == "angle") {

        window.alert("The angle is not a allowed value !");

      }

      else {

        addResults(response.data); //update Table
        MathJax.typeset(); //render LaTeX
      }
     
    }).catch(function (error) {
        console.error(error);
    });

  }
 
//Check which spacegroup is selected and construct the Table accordingly
async function check_spaceg_select(database) {
  let table = document.getElementById("sortie");
  let spg = document.getElementById("spaceg");
  test = table.rows.length
  if(test == 0) {
    
    var selSpg = spg.options[spg.selectedIndex].value;
    
    await getData(selSpg+ "_name.txt").then(() => {
      var textByLine = databaseJson.split("\t")
      var row = document.createElement("tr");
      for (let i = 0; i < textByLine.length; i++) {
        var cell = document.createElement("td");
        var html = MathJax.tex2chtml(textByLine[i]);

        cell.appendChild(html);

        row.appendChild(cell);
      }
      table.appendChild(row);
    });
  }
}

//Update Table
function addResults(results_str) {

  let table = document.getElementById("sortie");
  var config = results_str[1]
  var fullstr = config + "\t" + results_str[2]
  var truestr = fullstr.replace("\\left[\\begin{matrix}","")
  truestr = truestr.replace("\\end{matrix}\\right]","")
 
  var textByLine = truestr.split("&")
  var nb_element = textByLine.length

  var row = document.createElement("tr");


  for (let i = 0; i < nb_element; i++) {
    
      var cell = document.createElement("td");
      var html = MathJax.tex2chtml(textByLine[i]);
      cell.appendChild(html);
      row.appendChild(cell);
  
  }
  table.appendChild(row);
}

//Switch between dark and light mode
function dark() {
  if(localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', 'light-theme');
  } else {
    let link = document.getElementById("dark_mode_btn");
    if(document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'light-theme');
      document.body.classList.remove('dark-theme');
      link.innerHTML = "Dark Mode";
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
      link.innerHTML = "Light Mode";
    }
  }
}

//Initial theme
function initTextTheme() {
    let link = document.getElementById("dark_mode_btn");
    if(document.body.classList.contains('dark-theme')) {
      link.innerHTML = "Light Mode";
    } else {
      link.innerHTML = "Dark Mode";
    }
}

initTextTheme();

//Clear table
function reset_table()
{
  let table = document.getElementById("sortie");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

let pointVector = document.getElementById('pointing_vector');
let inputsPointVector = document.getElementById('custom-pointing-vector');

let refAxis = document.getElementById('ref_axis');
let customRefAxis = document.getElementById('custom-ref-axis');

if(pointVector != null)
{
  pointVector.addEventListener('change', () => { other(pointVector, inputsPointVector, 'point-vector-') });
}

if(refAxis != null)
{
  refAxis.addEventListener('change', () => { other(refAxis, customRefAxis, 'ref-axis-') });
}

//construct/destroy new box when "Other" is selected, allows custom vector values
function other(select, div, id) {
    const return_char = document.createElement("label")
    return_char.innerHTML="<br/>"

    if (select.options[select.selectedIndex].value == 'Other') {
        for (let i = 0; i < 3; i++) {
            const char = String.fromCharCode(120 + i);
            let label = document.createElement('label');
            label.innerText = ``;
           
            label.innerText += `Along ${char} : `;
            label.htmlFor = id + '' + char;
            let input = document.createElement('input');
            input.type = 'number';
            input.min = "0"
            input.id = id + '' + char;
            
            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(return_char)
        }
    } else {
        while (div.childElementCount > 0) {
            div.lastElementChild.remove();
        }
    }
}

//remove matrix
function reset_table_matrix()
{
  let table = document.getElementById("matrix");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

//print matrix
async function addMatrix(database) {

  let table = document.getElementById("matrix");
  let btn = document.getElementById("matrix_btn");
  let spg = document.getElementById("spaceg");
  test = table.rows.length

  if(test == 0) {
    
    var selSpg = spg.options[spg.selectedIndex].value;

    //console.log(textByLine)
    await getData(selSpg+ "_matrix.txt").then(() => {
      var textByLine = databaseJson.split(";")
      var row = document.createElement("tr");
      for (let i = 0; i < textByLine.length; i++) {
        var cell = document.createElement("td");
        var html = MathJax.tex2chtml(textByLine[i]);
  
        cell.appendChild(html);
  
        row.appendChild(cell);
      }
      table.appendChild(row);
    });
  }

  if (btn.innerHTML === "Show Raman Tensor") {
    btn.innerHTML = "Hide Raman Tensor";
    table.style.display = "block";
  } else {
    btn.innerHTML = "Show Raman Tensor";
    table.style.display = "none";
  }
}

async function print_matrix()
{
  reset_table_matrix()
  await addMatrix(database)
  MathJax.typeset()

}

//print help
function print_schema()
{
  let btn = document.getElementById("help_btn");
  let image = document.getElementById("schema")
  image.src= "img/illustration.png";

  if (btn.innerHTML === "Show Exemple") {
    btn.innerHTML = "Hide Exemple";
    image.style.display = "block";
  } else {
    btn.innerHTML = "Show Exemple";
    image.style.display = "none";
  }
}

// save using tex format the table
function save_tex(){

  let table = document.getElementById("sortie")
  var table_Rows = table.rows;
  let result_output = []
  let result_str =""
  let number_col = "|c||"
  let nb_element

    // Define a mapping for each mathematical italic character to its regular counterpart
  const italicToRegularMap = {
  "𝐴": "A", "𝑨": "A",
  "𝐵": "B", "𝑩": "B",
  "𝐶": "C", "𝑪": "C",
  "𝐷": "D", "𝑫": "D",
  "𝐸": "E", "𝑬": "E",
  "𝐹": "F", "𝑭": "F",
  "𝐺": "G", "𝑮": "G",
  "𝐻": "H", "𝑯": "H",
  "𝐼": "I", "𝑰": "I",
  "𝐽": "J", "𝑱": "J",
  "𝐾": "K", "𝑲": "K",
  "𝐿": "L", "𝑳": "L",
  "𝑀": "M", "𝑴": "M",
  "𝑁": "N", "𝑵": "N",
  "𝑂": "O", "𝑶": "O",
  "𝑃": "P", "𝑷": "P",
  "𝑄": "Q", "𝑸": "Q",
  "𝑅": "R", "𝑹": "R",
  "𝑆": "S", "𝑺": "S",
  "𝑇": "T", "𝑻": "T",
  "𝑈": "U", "𝑼": "U",
  "𝑉": "V", "𝑽": "V",
  "𝑊": "W", "𝑾": "W",
  "𝑋": "X", "𝑿": "X",
  "𝑌": "Y", "𝒀": "Y",
  "𝑍": "Z", "𝒁": "Z",
  "𝑎": "a", "𝒂": "a",
  "𝑏": "b", "𝒃": "b",
  "𝑐": "c", "𝒄": "c",
  "𝑑": "d", "𝒅": "d",
  "𝑒": "e", "𝒆": "e",
  "𝑓": "f", "𝒇": "f",
  "𝑔": "g", "𝒈": "g",
  "ℎ": "h", "𝒉": "h",
  "𝑖": "i", "𝒊": "i",
  "𝑗": "j", "𝒋": "j",
  "𝑘": "k", "𝒌": "k",
  "𝑙": "l", "𝒍": "l",
  "𝑚": "m", "𝒎": "m",
  "𝑛": "n", "𝒏": "n",
  "𝑜": "o", "𝒐": "o",
  "𝑝": "p", "𝒑": "p",
  "𝑞": "q", "𝒒": "q",
  "𝑟": "r", "𝒓": "r",
  "𝑠": "s", "𝒔": "s",
  "𝑡": "t", "𝒕": "t",
  "𝑢": "u", "𝒖": "u",
  "𝑣": "v", "𝒗": "v",
  "𝑤": "w", "𝒘": "w",
  "𝑥": "x", "𝒙": "x",
  "𝑦": "y", "𝒚": "y",
  "𝑧": "z", "𝒛": "z"
};

    // Function to convert mathematical italic characters to regular characters
  function convertToRegular(text) {
  let result = "";
  for (let char of text) {
    if (italicToRegularMap[char]) {
      result += italicToRegularMap[char];
    } else {
      result += char;
    }
  }
  return result;
}
 
  function replaceMathematicalSubscripts(text) {
  // Regular expression to match "V" or "H" followed by one or more digits
  const regex = /([VH])(\d+)/g;
  return text.replace(regex, "$$1_{$2}$$");
}

  for (let i = 0; i < table_Rows.length; i++) {
    const element = table_Rows[i].innerText;
    result_output[i] = element.split("\t")
    
    nb_element = result_output[0].length

    for (let j = 0; j < result_output[0].length; j++) {
      result_output[i][j] = result_output[i][j].replaceAll("\n","")
      result_output[i][j] = result_output[i][j].replaceAll("|","\\left|")
      result_output[i][j] = result_output[i][j].replaceAll("|2","\\right|^2")
      result_output[i][j] = convertToRegular(result_output[i][j])
      result_output[i][j] = result_output[i][j].replaceAll("1g","_{1g}")
      result_output[i][j] = result_output[i][j].replaceAll("2g","_{2g}")
      result_output[i][j] = result_output[i][j].replaceAll("3g","_{3g}")
      result_output[i][j] = replaceMathematicalSubscripts(result_output[i][j]);
      result_output[i][j] = result_output[i][j].replaceAll("Eg","E_g")
  
      if (j>0) {
        result_output[i][j] = "$" + result_output[i][j] + "$"
      }

      if (j!= nb_element-1)
        {result_output[i][j] = result_output[i][j] + " & "}
      result_str+=result_output[i][j]
    }
    if (i !=  table_Rows.length -1) {
      result_str += "\\\\ \n \\midrule \n"
    }
   else {
      result_str += " \\\\ \n"
    }
   
  }

  console.log(result_output)
  for (let j = 1; j < nb_element; j++) {
    number_col+= "c|"
   }

  result_str = "\\usepackage{booktabs}\n \\usepackage{adjustbox}\n\\usepackage{float}\n\\usepackage{hyperref}\n\\usepackage{amsmath}\n\\usepackage{amssymb}\n\nThe online version of the article can be found at \\href{https://doi.org/10.1016/j.softx.2022.101152}{https://doi.org/10.1016/j.softx.2022.101152}. \n\n \\begin{table}[H] \n \\centering \n \\begin{adjustbox}{max width=\\textwidth} \n \\begin{tabular}{" + number_col +"}\n \\toprule \n" + result_str + "\\bottomrule \n \\end{tabular} \n \\end{adjustbox} \n \\caption{Raman selection rules for the space group. Calculation are from Setnikar \\textit{et al.} \\cite{Setnikar2022}}. \n \\label{myselectionrules} \n \\end{table} \n\n \%Put this in your .bib file \n @article{Setnikar2022,\n  title = {Raman {{Selection Rules Calculator}}: {{A}} Simplified Selection Rules Calculator for {{Raman}} Spectroscopy Experiment}, \n  shorttitle = {Raman {{Selection Rules Calculator}}},\n  author = {Setnikar, Gr{\'e}gory and Samson, Julien and M{\'e}asson, Marie-Aude},\n  year = {2022},\n  month = jul,\n  journal = {SoftwareX}, \n  volume = {19}, \n  pages = {101152}, \n  issn = {23527110}, \n  doi = {10.1016/j.softx.2022.101152}, \n  langid = {english}, \n }"
  
  const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(a.href);
  };
  
  downloadToFile(result_str, 'my_selection_rules.tex', 'text/plain');


}

//for mobile users
function burger_open()
{
  burger_btn = document.getElementById("burger_btn");
  nav_menu = document.getElementById("nav-menu");

  burger_btn.classList.add('is-active');
  nav_menu.classList.add('is-active');
  
  
  burger_btn.onclick = burger_close;
 
  
}
function burger_close()
{
  burger_btn = document.getElementById("burger_btn");
  nav_menu = document.getElementById("nav-menu");

  burger_btn.classList.remove('is-active');
  nav_menu.classList.remove('is-active');
  
  burger_btn.onclick = burger_open;
    
}
