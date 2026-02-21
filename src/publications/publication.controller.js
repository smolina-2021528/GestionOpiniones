import { Publication } from './publication.model.js';
import { User } from '../users/user.model.js';

/* =========================
   CREATE PUBLICATION
   ========================= */
export const createPublication = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const publication = await Publication.create({
      UserId: req.userId,
      Title: title,
      Category: category,
      Content: content,
    });
    return res.status(201).json({ success: true, message: 'Publicación creada.', data: publication });
  } catch (error) {
    console.error('Error en createPublication:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/* =========================
   GET ALL PUBLICATIONS
   ========================= */
export const getPublications = async (req, res) => {
  try {
    const publications = await Publication.findAll({
      include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
      order: [['created_at', 'DESC']],
    });
    return res.status(200).json({ success: true, data: publications });
  } catch (error) {
    console.error('Error en getPublications:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/* =========================
   GET ONE PUBLICATION
   ========================= */
export const getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id, {
      include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
    });
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }
    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error('Error en getPublicationById:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/* =========================
   UPDATE PUBLICATION
   ========================= */
export const updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }
    if (publication.UserId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta publicación.' });
    }

    const { title, category, content } = req.body;
    await publication.update({
      Title: title || publication.Title,
      Category: category || publication.Category,
      Content: content || publication.Content,
    });

    return res.status(200).json({ success: true, message: 'Publicación actualizada.', data: publication });
  } catch (error) {
    console.error('Error en updatePublication:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

/* =========================
   DELETE PUBLICATION
   ========================= */
export const deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }
    if (publication.UserId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta publicación.' });
    }

    await publication.destroy();
    return res.status(200).json({ success: true, message: 'Publicación eliminada.' });
  } catch (error) {
    console.error('Error en deletePublication:', error);
    return res.status(500).json({ success: false, message: 'Error interno en el servidor' });
  }
};