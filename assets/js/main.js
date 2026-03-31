const searchInput = document.querySelector('.toolbar input[name="q"]')
if (searchInput) {
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') searchInput.value = ''
  })
}

const csvForm = document.getElementById('csv-import-form')
const csvFileInput = document.getElementById('csvFile')
const csvContent = document.getElementById('csvContent')

if (csvForm && csvFileInput && csvContent) {
  csvForm.addEventListener('submit', async (event) => {
    const file = csvFileInput.files[0]

    if (!file) {
      event.preventDefault()
      alert('Выберите CSV файл')
      return
    }

    event.preventDefault()
    const text = await file.text()
    csvContent.value = text
    csvForm.submit()
  })
}
