const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");
const client_controller = require("../controllers/clientController");
const manufacturer_controller = require("../controllers/manufacturerController");
const mechs_controller = require("../controllers/mechsController");
const mech_part_instance_controller = require("../controllers/mechpartinstanceController");
const storage_controller = require("../controllers/storageController");

router.get("/", mechs_controller.index);

router.get("/mechs/create", mechs_controller.mechs_create_GET);
router.post("/mechs/create", mechs_controller.mechs_create_POST);
router.get("/mechs/delete/:id", mechs_controller.mechs_delete_GET);
router.delete("/mechs/delete/:id", mechs_controller.mechs_delete_DELETE);
router.get("/mechs/update/:id", mechs_controller.mechs_update_GET);
router.put("/mechs/update/:id", mechs_controller.mechs_update_UPDATE);
router.get("/mechs", mechs_controller.mechs_list);
router.get("/mechs/:id", mechs_controller.mechs_detail);

router.get(
  "/mechpartinstance/create",
  mech_part_instance_controller.mechpartinstance_create_GET
);
router.post(
  "/mechpartinstance/create",
  mech_part_instance_controller.mechpartinstance_create_POST
);
router.get(
  "/mechpartinstance/delete/:id",
  mech_part_instance_controller.mechpartinstance_delete_GET
);
router.delete(
  "/mechpartinstance/delete/:id",
  mech_part_instance_controller.mechpartinstance_delete_DELETE
);
router.get(
  "/mechpartinstance/update/:id",
  mech_part_instance_controller.mechpartinstance_update_GET
);
router.put(
  "/mechpartinstance/update/:id",
  mech_part_instance_controller.mechpartinstance_update_PUT
);
router.get(
  "/mechpartinstances",
  mech_part_instance_controller.mechpartinstance_list
);
router.get(
  "/mechpartinstance/:id",
  mech_part_instance_controller.mechpartinstance_detail
);

router.get("/storage/create", storage_controller.storage_create_GET);
router.post("/storage/create", storage_controller.storage_create_POST);
router.get("/storage/delete/:id", storage_controller.storage_delete_GET);
router.delete("/storage/delete/:id", storage_controller.storage_delete_DELETE);
router.get("/storage/update/:id", storage_controller.storage_update_GET);
router.put("/storage/update/:id", storage_controller.storage_update_PUT);
router.get("/storages", storage_controller.storage_list);
router.get("/storage/:id", storage_controller.storage_detail);

router.get("/category/create", category_controller.category_create_GET);
router.post("/category/create", category_controller.category_create_POST);
router.get("/category/delete/:id", category_controller.category_delete_GET);
router.delete(
  "/category/delete/:id",
  category_controller.category_delete_DELETE
);
router.get("/category/update/:id", category_controller.category_update_GET);
router.put("/category/update/:id", category_controller.category_update_PUT);
router.get("/categories", category_controller.category_list);
router.get("/category/:id", category_controller.category_detail);

router.get("/client/create", client_controller.client_create_GET);
router.post("/client/create", client_controller.client_create_POST);
router.get("/client/delete/:id", client_controller.client_delete_GET);
router.delete("/client/delete/:id", client_controller.client_delete_DELETE);
router.get("/client/update/:id", client_controller.client_update_GET);
router.put("/client/update/:id", client_controller.client_update_PUT);
router.get("/clients", client_controller.client_list);
router.get("/client/:id", client_controller.client_detail);

router.get(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_GET
);
router.post(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_POST
);
router.get(
  "/manufacturer/delete/:id",
  manufacturer_controller.manufacturer_delete_GET
);
router.delete(
  "/manufacturer/delete/:id",
  manufacturer_controller.manufacturer_delete_DELETE
);
router.get(
  "/manufacturer/update/:id",
  manufacturer_controller.manufacturer_update_GET
);
router.put(
  "/manufacturer/update/:id",
  manufacturer_controller.manufacturer_update_PUT
);
router.get("/manufacturers", manufacturer_controller.manufacturer_list);
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);

module.exports = router;
