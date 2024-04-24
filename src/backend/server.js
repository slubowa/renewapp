import express from "express";
import bcrypt from "bcrypt"
import cors from 'cors';
import dotenv from "dotenv"
import db from "./database.js"
import jwt from "jsonwebtoken";
import energyAlgorithm from "./energyAlgorithm.js"
import costProjection from "./costProjection.js"
import { sendEmail } from './emailService.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 


  if (token == null) return res.sendStatus(401); 
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
      req.user = decoded; 
      next(); 
  })};


//ROUTES//

app.get('/protected', (req, res) => {
    res.status(200).send('Server is reachable');
  });
  

//create a users
app.post('/register', async (req, res) => {
    try {
      const { firstName, lastName, username, password, userType } = req.body;
      console.log(req.body);
  
      // Check if user already exists with the same email or username
      const existingUser = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [ username]
      );
  
      if (existingUser.rows.length > 0) {
        // User already exists
        return res.status(400).json({ message: 'User already exists with the same username.' });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = await db.query(
        'INSERT INTO users (firstname, lastname, username, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [firstName, lastName, username, hashedPassword, userType]
      );
  
      const user = newUser.rows[0];
        // Generate JWT token for the new user
        const token = jwt.sign(
            { userId: user.id }, // Payload contains the new user ID
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
         console.log("user:",user);
        res.json({ token, user: { id: user.id, username: user.username, userType:user.user_type }, isNewUser:true });
        
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
//login a users

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);
    const userQueryResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log(`Query results:`, userQueryResult.rows);

    if (userQueryResult.rows.length > 0) {
      const user = userQueryResult.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // User authenticated, generate a JWT token
        const token = jwt.sign(
          { userId: user.id }, 
          process.env.JWT_SECRET, // secret key for signing the token
          { expiresIn: process.env.JWT_EXPIRATION } 
        );

        res.json({ token, user:{id:user.id,username:user.username, firstname:user.firstname,user_type:user.user_type, isNewUser:false} });
      } else {
        res.status(401).json({ message: 'Authentication failed' }); // Password does not match
      }
    } else {
      res.status(404).json({ message: 'User not found' }); // User not found
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
        
//client submits enery requirements
app.post('/submit-energy-requirements/',authenticateToken, async (req, res) => {
  const { averageMonthlyConsumption, currentEnergyCost, numberOfBulbs, income, ownsTelevision, screenSize, ownsFridge, 
        fridgeSize, primaryEnergySource, gridUnitCost } = req.body;
  console.log(req.user.userId);
  const userId = req.user.userId;
  console.log(userId);

  // Convert 'Yes'/'No' answers to boolean
  const ownsTelevisionBool = ownsTelevision === 'Yes';
  const ownsFridgeBool = ownsFridge === 'Yes';

  try {
      const result = await db.query(
          `INSERT INTO energy_consumption (average_monthly_consumption, current_energy_cost, number_of_bulbs, income, 
            owns_television, screen_size, owns_fridge, fridge_size, primary_energy_source, 
            user_id, grid_unit_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          [averageMonthlyConsumption, currentEnergyCost, numberOfBulbs, income, 
            ownsTelevisionBool, screenSize, ownsFridgeBool, fridgeSize, primaryEnergySource, userId, gridUnitCost]
      );
      res.json({ data: result.rows[0], message: "Form data submitted successfully." });
  } catch (error) {
      console.error('Error saving energy requirements form data:', error);
      res.status(500).send('Server error while submitting form data.');
  }
});
//get energy requirement for diplay frontend
app.get('/get-energy-consumption/:userId', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId; 
    const result = await db.query('SELECT * FROM energy_consumption WHERE user_id = $1', [user_id]);
    console.log(result.rows[0]);
    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching energy consumption data' });
  }
});

//Updating energy requirements endpoint
app.put('/update-energy-requirements/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId; 
  const {
    averageMonthlyConsumption,
    currentEnergyCost,
    numberOfBulbs,
    income,
    ownsTelevision,
    screenSize,
    ownsFridge,
    fridgeSize,
    primaryEnergySource,
    gridUnitCost
  } = req.body;
  console.log('body',req.body);

  // Convert 'Yes'/'No' answers to boolean for database
  const ownsTelevisionBool = ownsTelevision === 'Yes';
  const ownsFridgeBool = ownsFridge === 'Yes';

  console.log("Received screenSize:", screenSize);
  console.log("ownsTelevision:", ownsTelevision);

  try {
    const screenSizeToUpdate = ownsTelevision === 'Yes' ? screenSize : null;
    const fridgeSizeToUpdate = ownsFridge === 'Yes' ? fridgeSize : null;

    // Update existing entry in the database
    const result = await db.query(
      `UPDATE energy_consumption
       SET average_monthly_consumption = $1, current_energy_cost = $2, number_of_bulbs = $3, income = $4,
         owns_television = $5, screen_size = $6, owns_fridge = $7, fridge_size = $8, primary_energy_source = $9, grid_unit_cost = $10
       WHERE user_id = $11 RETURNING *`,
      [
        averageMonthlyConsumption, currentEnergyCost, numberOfBulbs, income, 
        ownsTelevisionBool, screenSizeToUpdate, ownsFridgeBool, fridgeSizeToUpdate, 
        primaryEnergySource, gridUnitCost, userId
      ]
    );

    if (result.rows.length > 0) {
      res.json({ data: result.rows[0], message: "Energy consumption details updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error('Error updating energy requirements:', error);
    res.status(500).send('Server error while updating form data.');
  }
});

//Token validation endpoint
app.get('/validate-token/', authenticateToken, async(req, res) => {
  
  console.log('Validating token on server...', req.headers['authorization']);
  if (req.user) {
    const user_id = req.user.userId;
    const results = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
    
    const user =results.rows[0];
    res.json({ user:{id:user.id,username:user.username, firstname:user.firstname, isNewUser:false},
      message: "Token is valid."
    });
    
  } else {
    res.status(401).json({
      valid: false,
      message: "Invalid token."
    });
  }
});
//get system recommendations
app.get('/system-recommendations/:userId', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    await energyAlgorithm(userId);
    const result = await db.query('SELECT * FROM system_recommendation WHERE user_id = $1', [userId]);
  
    if (result.rows.length > 0) {
      console.log(result.rows);
      res.json(result.rows[0]); 
    } else {
      res.status(404).json({ message: 'No recommendations found for the given user ID.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while processing recommendations.' });
  }
});
//cost projection route
app.get('/api/cost-projection/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const projectionData = await costProjection(userId);
    res.json(projectionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//supplier submit products route
app.post('/submit-product-details/',authenticateToken, async (req, res) => {
  const { equipmentType, batterySpecification, inverterSpecification,panelSpecification, quantity, unitCost } = req.body;
  console.log(req.user.userId);
  const supplierId = req.user.userId;
  console.log(supplierId);

  try {
      const result = await db.query(
          `INSERT INTO supplier_products (supplier_id, equipment_type, battery_specification, inverter_specification, 
            quantity,panel_specification, unit_cost) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [supplierId, equipmentType, batterySpecification, inverterSpecification, 
            quantity,panelSpecification, unitCost]
      );
      res.json({ data: result.rows[0], message: "Form data submitted successfully." });
  } catch (error) {
      console.error('Error saving product details form data:', error);
      res.status(500).send('Server error while submitting form data.');
  }
});
//supliers update product detaisl
app.put('/update-product-details/:userId', authenticateToken, async (req, res) => {
  const supplierId = req.user.userId; // Or req.user.userId based on how you set up authentication
  const { equipmentType, batterySpecification, inverterSpecification, quantity, panelSpecification, unitCost } = req.body;

  try {
    const result = await db.query(
      `UPDATE supplier_products
       SET equipment_type = $1, 
           battery_specification = $2, 
           inverter_specification = $3, 
           quantity = quantity + $4,  // 
           unit_cost = $5,
           panel_specification = $6
       WHERE supplierId = $7'
       RETURNING *;`,
      [equipmentType, batterySpecification, inverterSpecification, quantity, unitCost, panelSpecification, supplierId, conditionValue]
    );

    if (result.rows.length > 0) {
      res.json({ data: result.rows[0], message: "Energy consumption details updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error('Error updating energy requirements:', error);
    res.status(500).send('Server error while updating form data.');
  }
});

app.post('/submit-or-update-product-details/', authenticateToken, async (req, res) => {
  const { equipmentType, batterySpecification, inverterSpecification, panelSpecification, quantity, unitCost } = req.body;
  const supplierId = req.user.userId;

  try {
    // Check for existing entry
    const checkExistQuery = `
    SELECT * FROM supplier_products
    WHERE supplier_id = $1
      AND equipment_type = $2
      AND (
        (equipment_type = 'battery' AND battery_specification = COALESCE($3, battery_specification)) OR
        (equipment_type = 'inverter' AND inverter_specification = COALESCE($4, inverter_specification)) OR
        (equipment_type = 'panel' AND panel_specification = COALESCE($5, panel_specification))
      );    
`;

    const existResult = await db.query(checkExistQuery, [supplierId, equipmentType, batterySpecification, inverterSpecification, panelSpecification]);

    if (existResult.rows.length > 0) {
      // Update existing entry
      const updateQuery = `
      UPDATE supplier_products
      SET quantity = quantity + $6,
          unit_cost = $7
      WHERE supplier_id = $1
        AND equipment_type = $2
        AND (
          (equipment_type = 'battery' AND battery_specification = COALESCE($3, battery_specification)) OR
          (equipment_type = 'inverter' AND inverter_specification = COALESCE($4, inverter_specification)) OR
          (equipment_type = 'panel' AND panel_specification = COALESCE($5, panel_specification))
        );      
`;

       await db.query(updateQuery, [supplierId, equipmentType, batterySpecification, inverterSpecification, panelSpecification, quantity, unitCost]);

    } else {
      
      const insertQuery = `
      INSERT INTO supplier_products (supplier_id, equipment_type, battery_specification, inverter_specification, panel_specification, quantity, unit_cost)
      VALUES (
        $1, 
        $2, 
        CASE WHEN $2 = 'battery' THEN $3 ELSE NULL END, 
        CASE WHEN $2 = 'inverter' THEN $4 ELSE NULL END, 
        CASE WHEN $2 = 'panel' THEN $5 ELSE NULL END, 
        $6, 
        $7
      );
    `;
    
      await db.query(insertQuery, [supplierId, equipmentType, batterySpecification, inverterSpecification, panelSpecification, quantity, unitCost]);
    }

    res.json({ message: "Product details updated successfully." });
  } catch (error) {
    console.error('Error processing product details:', error);
    res.status(500).send('Server error while processing product details.');
  }
});

//get supplier products
app.get('/supplier-products/:userId', authenticateToken, async (req, res) => {
  const  supplierId = req.user.userId;
  console.log(supplierId);
  try {
    const result = await db.query(
      `SELECT equipment_type, battery_specification, inverter_specification, panel_specification, COALESCE(SUM(quantity), 0) as total_quantity, 
      COALESCE(AVG(unit_cost), 0) as unit_cost FROM supplier_products WHERE supplier_id = $1
      GROUP BY equipment_type, battery_specification, inverter_specification, panel_specification, unit_cost;`,
      [supplierId]
    );
    console.log(result);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).send('Server error while fetching products.');
  }
});
//get products for products page 
app.get('/products', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sp.equipment_type, sp.battery_specification, sp.inverter_specification, sp.panel_specification, 
      SUM(sp.quantity) AS total_quantity, AVG(sp.unit_cost) AS unit_cost, u.username AS supplier_username, 
      sp.supplier_id FROM supplier_products sp JOIN users u ON sp.supplier_id = u.id GROUP BY sp.equipment_type, 
      sp.battery_specification, sp.inverter_specification,sp.panel_specification, u.username, sp.supplier_id;`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error while fetching products.');
  }
});

//submit an order
app.post('/submit-product-order/',authenticateToken, async (req, res) => {
  const { equipmentType, specification, quantity, supplier, totalCost } = req.body;
  console.log(req.body)

  console.log("Sending email via SendGrid API");

  const clientId = req.user.userId
  const supplierEmail = supplier
  
  console.log(clientId);
  
  const clientEmailResult = await db.query(`SELECT username FROM users WHERE id = $1`,
  [clientId]);
  
  const clientEmail = clientEmailResult.rows[0].username;

  const supplierIdResult = await db.query(`SELECT id FROM users WHERE username = $1`,
  [supplier]);
  const supplierId = supplierIdResult.rows[0].id;

  // Dynamic content generation for the email of both supplier and client
const orderSummary = `Order Details:
- Equipment Type: ${equipmentType}
- Specification: ${specification}
- Quantity: ${quantity}
- Total Cost: $${totalCost}`;

const textContentForSupplier = `New Order Received! ${orderSummary} Please review the order details.`;
const htmlContentForSupplier = `<h1>New Order Received!</h1><p>${orderSummary.replace(/\n/g, '<br>')}</p>`;
  
const textContentForClient = `Your Order Submission Confirmation ${orderSummary} Thank you for your order!`;
const htmlContentForClient = `<h1>Your Order Submission Confirmation</h1><p>${orderSummary.replace(/\n/g, '<br>')}</p>`;
  
  
const orderCost = totalCost;

try {
      const result = await db.query(
          `INSERT INTO orders (supplier_username, client_id, equipment_type, specification, quantity, order_cost) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING *`,
          [supplier, clientId, equipmentType, specification, quantity, orderCost]
      );
      // Send email to supplier
      try {
        await sendEmail(supplierEmail, "New Order Notification", textContentForSupplier, htmlContentForSupplier);
        console.log('Email sent to supplier');
      } catch (error) {
        console.error('Failed to send email to supplier:', error);
      }
      // Send email to client
      try {
        await sendEmail(clientEmail, "Order Submission Confirmation", textContentForClient, htmlContentForClient);
        console.log('Email sent to client');
      } catch (error) {
        console.error('Failed to send email to client:', error);
      }
      await db.query(
        `INSERT INTO notifications (user_id, message, read_status, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [supplierId, `New order received: ${quantity}x ${equipmentType} (${specification}), Total Cost: ${totalCost}`, 'false']
      );
      

      await db.query(
        `INSERT INTO notifications (user_id, message, read_status, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [clientId, `Your order of ${quantity}x ${equipmentType} (${specification}) has been submitted, Total Cost: ${totalCost}`, 'false']
      );

      res.json({ data: result.rows[0], message: "order data submitted successfully and notifications sent." });
  } catch (error) {
      console.error('Error saving order details and creating notifications:', error);
      res.status(500).send('Server error while saving order.');
  }
});
//get unread notifications count
app.get('/notifications/unread-count', authenticateToken, async (req, res) => {
  const userId = req.user.userId; 

  try {
    const queryResult = await db.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND read_status = $2',
      [userId, 'false'] 
    );
    const unreadCount = queryResult.rows[0] ? parseInt(queryResult.rows[0].count, 10) : 0;
    console.log(unreadCount);
    res.json({ count: unreadCount}); 
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).send('Server error while fetching unread notifications count.');
  }
});

//get notifications
app.get('/getNotifications', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Server error while fetching notifications.');
  }
});

//mark notifications as unread
app.post('/notifications-mark-read/:notificationId/read', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const notificationId = parseInt(req.params.notificationId, 10);

  try {
    const ownershipCheck = await db.query(
      'SELECT * FROM notifications WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );

    if (ownershipCheck.rows.length === 0) {
      return res.status(404).send('Notification not found or access denied.');
    }
    await db.query(
      'UPDATE notifications SET read_status = true WHERE id = $1',
      [notificationId]
    );

    res.send('Notification marked as read.');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send('Server error while updating notification.');
  }
});

// GET user info
app.get('/get-user/', authenticateToken, async (req, res) => {

  const userId = req.user.userId;

  try {
    const result = await db.query('SELECT firstname, lastname, username,user_type FROM users WHERE id = $1', [userId]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).send('Server error while fetching user information.');
  }
});

// POST update user info
app.post('/update-user/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { firstname, lastname, username, currentPassword, newPassword } = req.body;

  try {
    if (currentPassword && newPassword) {
      // Fetch the current user's password hash from the database
      const user = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
      if (user.rows.length === 0) {
        return res.status(404).send('User not found.');
      }

      // Verify the current password with the hash stored in the database
      const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password);
      if (!validPassword) {
        return res.status(401).send('Current password is incorrect.');
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the password along with other user details
      const result = await db.query(
        'UPDATE users SET firstname = $1, lastname = $2, username = $3, password = $4 WHERE id = $5 RETURNING *',
        [firstname, lastname, username, hashedPassword, userId]
      );
      res.json(result.rows[0]);
    } else {
      const result = await db.query(
        'UPDATE users SET firstname = $1, lastname = $2, username = $3 WHERE id = $4 RETURNING *',
        [firstname, lastname, username, userId]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).send('Server error while updating user information.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});








