// Copyright 2019 Stanford University see LICENSE for license

import React from "react"

const DescPanel = () => {
  const throwException = () => {
    throw new Error("What, me worry?")
  }

  return (
    <div className="desc-panel">
      <h3 onDoubleClick={() => throwException()}>
        The underdrawing for the new world of linked data in libraries
      </h3>
      <p>Sinopia is a linked data creation environment where libraries can: </p>
      <ul>
        <li>
          create metadata in a linked data environment without having to set up
          and maintain tools
        </li>
        <li>learn best practices related to linked data creation</li>
        <li>
          explore the idea of cooperative cataloging (linking to shared
          descriptions and identifiers) in a linked data environment
        </li>
        <li>
          contribute feedback and expertise to iterative development of tools
          for working in a linked data environment
        </li>
      </ul>
      <p>
        Sinopia is developed by the{" "}
        <a href="https://wiki.lyrasis.org/display/LD4P2">
          Linked Data for Production: Pathway to Implementation (LD4P2)
        </a>{" "}
        project, a collaboration among Cornell University, Harvard University,
        the Library of Congress, Stanford University, the School of Library and
        Information Science at the University of Iowa, and the Program for
        Cooperative Cataloging (PCC).
      </p>
      <p>
        The term <i>sinopia</i> refers to &quot;The preliminary drawing for a
        fresco or mural, named for the reddish-brown pigment traditionally used
        to draw or transfer it.&quot; (
        <a href="http://www.lynnerutter.com/glossary.php#s">
          Glossary of Esoteric Architectural and Design Terms by Lynne Rutter
        </a>
        ) LD4P&apos;s Sinopia is also a preliminary step, a sketch of
        what&apos;s possible, on the way to a full-fledged linked data
        production environment.
      </p>
    </div>
  )
}

export default DescPanel
