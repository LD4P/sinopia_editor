import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { rdfDatasetFromN3 } from 'Utilities'
import Alert from '../Alert'
import N3 from 'n3'

const RDFDisplay = (props) => {
  const [error, setError] = useState(false)
  const [dataset, setDataset] = useState(false)
  useEffect(() => {
    setError(false)
    rdfDatasetFromN3(props.rdf)
      .then(dataset => setDataset(dataset))
      .catch(err => setError(err.toString()))
  }, [props.rdf])

  const [format, setFormat] = useState('table')
  const [formattedRDF, setFormattedRDF] = useState(false)
  useEffect(() => {
    if (!dataset || format === 'table') return
    setError(false)
    const writer = new N3.Writer({ format: format === 'n-triples' ? 'N-Triples' : undefined })
    writer.addQuads(dataset.toArray())
    writer.end((error, result) => {
      if (error) {
        setError(error.toString())
      } else {
        setFormattedRDF(result.replace(/<null>/g, '<>'))
      }
    })
  }, [dataset, format])

  if (error) {
    return (<Alert text={error} />)
  }

  if (format !== 'table' && !formattedRDF) {
    return null
  }
  if (format === 'table' && !dataset) {
    return null
  }

  let body
  if (format === 'table') {
    const rows = dataset.toArray().map(quad => <tr key={[quad.subject.value, quad.predicate.value, quad.object.value].concat('-')}>
      <td>{quad.subject.value || '<>'}</td>
      <td>{quad.predicate.value}</td>
      <td>{quad.object.value}{quad.object.language && ` [${quad.object.language}]`}</td>
    </tr>)
    body = (
      <table className="table table-striped table-sm" style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Predicate</th>
            <th scope="col">Object</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    )
  } else {
    body = (<pre style={{ padding: '5px' }}>{ formattedRDF }</pre>)
  }

  return (
    <div>
      <form className="form-inline">
        <label htmlFor="rdfFormat">Format: &nbsp;</label>
        <select className="form-control" id="rdfFormat"
                onBlur={event => setFormat(event.target.value)}
                onChange={event => setFormat(event.target.value)}
                value={format}>
          <option value="n-triples">N-Triples</option>
          <option value="table">Table</option>
          <option value="turtle">Turtle</option>
        </select>
      </form>
      { body }
    </div>
  )
}

RDFDisplay.propTypes = {
  rdf: PropTypes.string,
  id: PropTypes.string,
}

export default RDFDisplay
