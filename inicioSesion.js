const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

// Ruta del archivo Excel que contiene el nombre de usuario y contraseña
const excelFilePath = 'C:\\Users\\gusta\\OneDrive\\Escritorio\\VISAS\\USUARIOS.xlsx';
const sheetName = 'Hoja1'; // Nombre de la hoja en el archivo Excel

// Función para obtener credenciales desde Excel
function getCredentials() {
  const workbook = xlsx.readFile(excelFilePath);
  const worksheet = workbook.Sheets[sheetName];
  const username = worksheet['D3'].v;
  const password = worksheet['E3'].v;
  return { username, password };
}

async function logIn() {
  const { username, password } = getCredentials();
  // Ruta del navegador Chrome (reemplaza con la ruta correcta en tu sistema)
  const chromeExecutablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  // Opciones de Puppeteer
  const browserOptions = {
    executablePath: chromeExecutablePath, // Ruta del navegador Chrome
    headless: false, // Cambia a "true" si deseas que sea sin cabeza (headless)
  };
  
  try {
    // Inicializa el navegador
    const browser = await puppeteer.launch(browserOptions);
    // Abre una nueva página
    const page = await browser.newPage();
    // URL de la página que deseas cargar
    const urlToOpen = 'https://ais.usvisa-info.com/es-ar/niv/users/sign_in'; //
    // Navega a la página deseada:
    await page.goto(urlToOpen);

    // Ingresa el nombre de usuario y contraseña:
    await page.type('input[id="user_email"]', username);
    await page.type('input[id="user_password"]', password);
    //POENR EL CODIGO PARA EL CHECKBOX:
    await page.click('input[id="policy_confirmed"]');

    // Envía el formulario de inicio de sesión:
    await page.click('input[type="submit"]');
    await page.waitForSelector('a.button.primary.small');

    // Click en continuar.
    await page.click('a.button.primary.small');

    // Espera explícitamente al elemento del acordeón y haz clic en él
    await page.waitForSelector('a.accordion-title[aria-expanded="false"]');
    await page.click('a.accordion-title[aria-expanded="false"]');
    
    // Espera a que se cargue la siguiente página (ajusta el tiempo de espera según sea necesario)
    await page.waitForNavigation();

    // Cierra el navegador cuando hayas terminado
    await browser.close();
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

// Llama a la función para abrir el navegador y navegar
logIn();
