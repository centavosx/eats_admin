const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType })

  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

const exportToCsv = (e, head, data, keys, filename) => {
  e.preventDefault()
  // Headers for each column
  let headers = head

  // Convert users data to a csv
  let csv = data.reduce((acc, d) => {
    acc.push(keys.map((d2) => d[d2]).join(','))
    return acc
  }, [])

  downloadFile({
    data: [headers.join(','), ...csv].join('\n'),
    fileName: `${filename}.csv`,
    fileType: 'text/csv',
  })
}

export const CSVExport = (props) => {
  return (
    <button
      type="button"
      className="btn btn-primary btn-round"
      onClick={(e) => {
        exportToCsv(e, props.headers, props.data, props.keyVals, props.fileName)
      }}
    >
      Export to CSV
    </button>
  )
}
