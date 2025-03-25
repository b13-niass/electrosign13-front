"use client"

import { Button } from "@/components/shadcn-ui/button"
import { Download } from "lucide-react"

export function downloadYamlTemplate() {
    // Exemple de modèle YAML pour l'importation d'utilisateurs
    const yamlTemplate = `# Modèle d'importation d'utilisateurs
# Vous pouvez ajouter autant d'utilisateurs que nécessaire en suivant ce format

utilisateurs:
  - prenom: Jean # requis
    nom: Dupont # requis
    email: jean.dupont@example.com
    password: MotDePasse123 # requis
    telephone: "0123456789"
    photo: "" # Base64 ou URL
    cni: "1234567890"
    fonctionId: 1 # ID de la fonction (integer)
    roles: # requis, au moins un rôle
      - ADMIN
      - USER

  - prenom: Marie # requis
    nom: Martin # requis
    email: marie.martin@example.com
    password: MotDePasse456 # requis
    telephone: "0987654321"
    photo: "" # Base64 ou URL
    cni: "0987654321"
    fonctionId: 2 # ID de la fonction (integer)
    roles: # requis, au moins un rôle
      - USER
`

    // Créer un blob avec le contenu YAML
    const blob = new Blob([yamlTemplate], { type: "text/yaml" })

    // Créer une URL pour le blob
    const url = URL.createObjectURL(blob)

    // Créer un élément <a> pour le téléchargement
    const a = document.createElement("a")
    a.href = url
    a.download = "utilisateurs-template.yaml"

    // Ajouter l'élément au DOM, cliquer dessus, puis le supprimer
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    // Libérer l'URL
    URL.revokeObjectURL(url)
}

export function YamlTemplateButton() {
    return (
        <Button variant="outline" size="sm" onClick={downloadYamlTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Modèle YAML
        </Button>
    )
}

