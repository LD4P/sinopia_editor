---
name: Sinopia Alma Integration Request
about: For requesting Sinopia integrations with the Alma LSP
title: "[Sinopia Alma Integration Request]"
labels: ''
assignees: ''

---

**Institution name:**

**Contact name and email address for requesting institution:**

**Name of Sinopia institution group:**
Example: "stanford"

**Relevant Sinopia environments:**
- [ ] Institution has a Sinopia user group available in development, stage, and production
- [ ] At least one user is registered in the group in each environment

If your institution user group does not exist, or does not exist in all environments, please specify where your group needs to be added:
- [ ] Stage
- [ ] Production
- [ ] Development
- [ ] Exists in all 3 environments, no additions needed

**Alma credentials**
Confirm that credentials for the Sinopia / Alma integration can be provided upon request, and provide contact information if different than above.

**If the above perquisites have been met, please complete the following:**
- [ ] Create a Sinopia Editor PR to add group to src/Config.json [here](https://github.com/LD4P/sinopia_editor/blob/c06d7b49ab4475eafe63874daa8e6c94e5a05402/src/Config.js#L141-L151)
- [ ] Create an ILS-Middleware PR to add group to the alma DAG [here](https://github.com/LD4P/ils-middleware/blob/a2f5206245163209355ddf74ea226a9a369dced1/ils_middleware/dags/alma.py#L48-L60)
- [ ] Add group's credentials to ILS-Middleware
