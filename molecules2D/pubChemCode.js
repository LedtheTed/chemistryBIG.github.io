// pug-rest api converts name search to cid

async function nameToCID(name) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CID lookup failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.IdentifierList || !data.IdentifierList.CID.length) {
    throw new Error("No CID found for this compound.");
  }

  return data.IdentifierList.CID[0]; // take first match
}

// pug-view api searches cid and pulls json data

async function getPugViewDataCompound(cid) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PUG-View request failed: ${response.status}`);
  }

  return response.json();
}

async function getCompoundSDF(cid) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SDF request failed: ${response.status}`);
  }

  return response.text(); // SDF is plain text
}

async function searchCompound(compoundName) {
  try {
    console.log(`Searching CID for: ${compoundName}`);
    const cid = await nameToCID(compoundName);
    console.log(`Found CID: ${cid}`);

    console.log("Retrieving SDF structure...");
    const sdfData = await getCompoundSDF(cid);
    console.log(sdfData);

    // console.log("Retrieving PUG-View data...");
    const data = await getPugViewDataCompound(cid);

    // console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function sdfToGraph(sdfText) {
  const lines = sdfText.split("\n");

  const countsLine = lines[3];
  const atomCount = parseInt(countsLine.substring(0, 3));
  const bondCount = parseInt(countsLine.substring(3, 6));

  // Parse atoms
  const atoms = [];
  for (let i = 4; i < 4 + atomCount; i++) {
    const line = lines[i];
    const element = line.substring(31, 34).trim().toLowerCase();
    atoms.push(element);
  }

  // Parse bonds
  const bonds = [];
  const bondStart = 4 + atomCount;

  for (let i = bondStart; i < bondStart + bondCount; i++) {
    const line = lines[i];

    const a1 = parseInt(line.substring(0, 3)) - 1;
    const a2 = parseInt(line.substring(3, 6)) - 1;

    bonds.push([a1, a2]);
  }

  return { atoms, bonds };
}

function renderMoleculeGraph(graph) {
  const elements = [];

  // Nodes (atoms)
  graph.atoms.forEach((atom, i) => {
    elements.push({
      data: { id: i.toString(), label: atom },
    });
  });

  // Edges (bonds)
  graph.bonds.forEach(([a1, a2]) => {
    elements.push({
      data: {
        source: a1.toString(),
        target: a2.toString(),
      },
    });
  });

  cytoscape({
    container: document.getElementById("molecule"),

    elements: elements,

    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          "background-color": "#66ccff",
        },
      },

      {
        selector: "edge",
        style: {
          width: 2,
        },
      },
    ],

    layout: {
      name: "cose",
    },
  });
}

async function visualizeCompound(compoundName) {
  const cid = await nameToCID(compoundName);

  const sdf = await getCompoundSDF(cid);

  const graph = sdfToGraph(sdf);

  renderMoleculeGraph(graph);
}

// testing
// node ./pubChem.js
// searchCompound("hydrogen peroxide");
export {
  nameToCID,
  getPugViewDataCompound,
  getCompoundSDF,
  searchCompound,
  sdfToGraph,
  renderMoleculeGraph,
  visualizeCompound
};