import AccessService from '../services/access.service';

class AccessController {
  signUp = async (req, res, next) => {
    try {
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
