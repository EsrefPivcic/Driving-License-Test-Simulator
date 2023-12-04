INSERT INTO "option" (questionid, optiontext, iscorrect) VALUES
(1, 'no, they are only required to wear protective goggles', false),
(1, 'yes', true),
(1, 'no', false),

(2, 'not time-limited', true),
(2, 'one year', false),
(2, 'two years', false),

(3, 'is not longer than 35 m nor shorter than 10 m', false),
(3, 'is not longer than 50 m nor shorter than 10 m', true),

(4, '1.00 m', true),
(4, '0.80 m', false),

(5, 'no', false),
(5, 'yes', true),

(6, '1.60 m', false),
(6, '2.00 m', true),
(6, '2.50 m', false),

(7, '60 km/h', false),
(7, '90 km/h', true),
(7, '80 km/h', false),

(8, 'yes', false),
(8, 'no', true),

(9, 'a motor vehicle with three wheels symmetrically arranged about the median longitudinal axis, with a heat engine whose displacement is greater than 50 cm³ or whose maximum design speed is greater than 45 km/h', true),
(9, 'a motor vehicle with three wheels symmetrically arranged about the median longitudinal axis, with a heat engine whose displacement is not greater than 50 cm³ or whose maximum design speed is not greater than 45 km/h', false),

(10, 'they must move one behind the other', true),
(10, 'they are not required to move one behind the other', false),

(11, 'is not required to move on the right bicycle lane in relation to the direction of traffic', false),
(11, 'must move on the right bicycle lane in relation to the direction of traffic', true),

(12, 'vehicles must move on the right side in the direction of vehicle movement', true),
(12, 'vehicles are not required to move on the right side in the direction of vehicle movement', false),

(13, 'release the handlebars, except when signaling a change of direction', true),
(13, 'move as close as possible to the right edge of the roadway', false),
(13, 'remove feet from the pedals', true),
(13, 'move on traffic surfaces where the movement of such vehicles is allowed', false),
(13, 'use headphones for audio devices in both ears', true),

(14, 'any person in traffic on the road who is in a vehicle', false),
(14, 'a person who is driving a vehicle on the road', true),

(15, 'roadway lane', true),
(15, 'roadway', false),
(15, 'traffic lane', false),

(16, 'the space that a participant in road traffic can see from their position', true),
(16, 'the place at an intersection from which the driver can see to the left-right at least 25 m', false),
(16, 'the place at an intersection from which the driver can see to the left at least 25 m', false),

(17, 'proof of a completed technical inspection', false),
(17, 'proof of paid toll', false),
(17, 'proof of vehicle registration', true),

(18, '4.5 m from the highest point of the roadway', true),
(18, '4 m from the highest point of the roadway', false),
(18, '6 m from the highest point of the roadway', false),

(19, 'wet and muddy road', true),
(19, 'dry road', false),
(19, 'vehicle load', true),

(20, 'during the month in which the deadline of 24 months from the day of the first vehicle registration expires, and during the month in which the deadline of 36 months from the day of the first vehicle registration expires', false),
(20, 'during the month in which the deadline of 12 months from the day of the first vehicle registration expires, and during the month in which the deadline of 36 months from the day of the first vehicle registration expires', false),
(20, 'during the month in which the deadline of 24 months from the day of the first vehicle registration expires, and during the month in which the deadline of 48 months from the day of the first vehicle registration expires', true),

(21, 'Adjusting driving to the road conditions', false),
(21, 'Sudden movements of the steering wheel', true),
(21, 'Sudden braking and stopping', true),

(22, 'Prepare to navigate through multiple consecutive curves, with the first one turning right', true),
(22, 'Warn traffic participants behind you with the right turn indicator', false),

(23, 'Proximity to a road section where the roadside is undefined', true),
(23, 'Proximity to a road section where the road is frozen', false),

(24, 'Continue moving with the vehicle because I have the right of way', false),
(24, 'Reduce the speed of the vehicle and, if necessary, stop the vehicle', true),
(24, 'Give way to vehicles from the opposite direction', true),

(25, 'Prohibition of traffic for all motor vehicles towing a trailer', true),
(25, 'Prohibition of traffic for all motor vehicles towing a light trailer', false),

(26, 'Electronic toll collection', true),
(26, 'Prohibition of using radio devices in the vehicle', false),

(27, 'Niche for stopping vehicles in case of danger', true),
(27, 'Area reserved for stopping public transport vehicles', false),

(28, 'Tire repair workshop', true),
(28, 'Place where you can check tire pressure', false),

(29, 'Increase attention', true),
(29, 'Provide assistance to those injured in a traffic accident', true),
(29, 'Increase the speed of the vehicle', false),

(30, 'Entering an area where there is an increased risk of uncontrolled fire outbreak', true),
(30, 'Entering an area where campfires are allowed for picnickers', false),

(31, 'Path number 1', true),
(31, 'Path number 2', false),

(32, '1 – 3 – 2', true),
(32, '2 – 3 – 1', false),
(32, '2 – 1 – 3', false),

(33, '2 – 1', true),
(33, '1 – 2', false),

(34, 'Give way to vehicle number 3 and then pass before vehicle number 2', true),
(34, 'Give way to vehicle number 3, then give way to vehicle number 2, and finally pass through the intersection', false),

(35, '2 – 3 – 4 – 1', false),
(35, '1 – 2 – 3 – 4', false),
(35, '2 – 3 – 1 – 4', true),

(36, 'Pass through the intersection before vehicle number 2 and give way to vehicle number 3', false),
(36, 'Give way to vehicle number 2 and then pass through the intersection before vehicle number 3', true),

(37, '3 – 4 – 2 – 1', true),
(37, '3 – 1 – 2 – 4', false),
(37, '4 – 2 – 1 – 3', false),

(38, '2 – 1 – 3', true),
(38, '3 – 1 – 2', false),
(38, '2 – 3 – 1', false),

(39, 'Yes', true),
(39, 'No', false),

(40, 'Number 1', true),
(40, 'Number 2', false)
(41, 'Yes', false),
  (41, 'No', true),

  -- Options for question 2
  (42, 'On a public road in the city', true),
  (42, 'On a test track and on a public road in the city', false),
  (42, 'Only on a test track', false),

  -- Options for question 3
  (43, '2.30 m', false),
  (43, '2.50 m', true),
  (43, '2.70 m', false),

  -- Options for question 4
  (44, 'Reasonably and calmly', false),
  (44, 'In accordance with regulations', false),
  (44, 'Spontaneously and unpredictably', true),

  -- Options for question 5
  (45, 'Aggressive driving', false),
  (45, 'Adhering to traffic rules and regulations', true),
  (45, 'Defensive driving', true),
  (45, 'Nervous driving', false),

  -- Options for question 6
  (46, 'A motor vehicle with malfunctioning lighting devices', false),
  (46, 'A motor vehicle with malfunctioning signaling devices', false),
  (46, 'A motor vehicle with malfunctioning braking devices', true),
  (46, 'A motor vehicle with malfunctioning steering devices', true),
  (46, 'A cargo motor vehicle and a bus', true),

  -- Options for question 7
  (47, '12 months from the date of issue', true),
  (47, '6 months from the date of issue', false),

  -- Options for question 8
  (48, 'That has a functioning steering device', false),
  (48, 'Heavier than the towing vehicle if its auxiliary brake is malfunctioning', true),

  -- Options for question 9
  (49, 'Any interruption of the vehicle''s movement on the road lasting up to 15 minutes, except for interruptions made to comply with a sign or rule regulating traffic', false),
  (49, 'Any interruption of the vehicle''s movement on the road lasting up to 5 minutes, except for interruptions made to comply with a sign or rule regulating traffic', true),

  -- Options for question 10
  (50, 'A person participating in traffic who does not operate a vehicle, nor is transported in a vehicle or on a vehicle', true),
  (50, 'A person operating a vehicle or being transported in a vehicle or on a vehicle', false),

  -- Options for question 11
  (51, 'Two traffic lanes', false),
  (51, 'One traffic lane', true),
  (51, 'More than two traffic lanes', false),

  -- Options for question 12
  (52, 'No later than one hour after consumption', true),
  (52, 'No later than 24 hours after consumption', false),

  -- Options for question 13
  (53, 'At least 100 meters outside urban areas, or at least 50 meters in urban areas', false),
  (53, 'At least 200 meters on a road outside urban areas, or at least 100 meters in urban areas', true),

  -- Options for question 14
  (54, '40 km/h', true),
  (54, '60 km/h, are not allowed on the highway', false),

  -- Options for question 15
  (55, '7%', false),
  (55, '4%', true),

  -- Options for question 16
  (56, 'No, if there are two traffic lanes in one direction', false),
  (56, 'No, if pedestrians are letting him pass', false),
  (56, 'It is prohibited', true),

  -- Options for question 17
  (57, 'No', true),
  (57, 'Yes', false),

  -- Options for question 18
  (58, 'Equipment on the road placed to reduce the speed of vehicle movement in places where the safety of traffic participants is particularly endangered', true),
  (58, 'Protective barriers and toll booths', false),

  -- Options for question 19
  (59, 'Any means of transportation intended for movement on the road, except for motorless wheelchairs for disabled individuals and children''s transportation devices', true),
  (59, 'Any motor vehicle intended for the transportation of people', false),

  -- Options for question 20
  (60, 'In accordance with the light traffic sign, provided that the meaning of that sign does not differ from the meaning of other traffic signs or traffic rules', false),
  (60, 'In accordance with traffic signals, provided that this does not deviate from the rules of traffic', false),
  (60, 'According to signs or orders given by authorized persons even if it deviates from the light traffic sign or other traffic sign or traffic rule', true);