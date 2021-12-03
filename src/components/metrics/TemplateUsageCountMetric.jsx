// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import CountCard from "./CountCard"
import useMetric from "hooks/useMetric"
import TemplateFilter, { defaultTemplateId } from "./TemplateFilter"

const TemplateUsageCountMetric = () => {
  const [params, setParams] = useState({
    templateId: defaultTemplateId,
  })

  const templateUsageCountMetric = useMetric(
    "getTemplateUsageCount",
    params,
    !!params.templateId // this prevents the metric API call from firing if there is no templateId
  )

  const footer = (
    <React.Fragment>
      <div className="row py-3">
        <label htmlFor="template-choice" className="col-sm-3">
          Selected template ID
        </label>
        <div className="col-sm-8">{params.templateId}</div>
      </div>
      <TemplateFilter params={params} setParams={setParams} />
    </React.Fragment>
  )

  return (
    <CountCard
      count={templateUsageCountMetric?.count}
      title="Template usage"
      help="The total number of resources created with the specified template."
      footer={footer}
    />
  )
}

export default TemplateUsageCountMetric
