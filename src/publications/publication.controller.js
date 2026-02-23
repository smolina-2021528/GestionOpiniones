import { Publication } from './publication.model.js';
import { User } from '../users/user.model.js';
import { Comment } from '../comments/comment.model.js';

// crear una publicacion
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

// obtener todas las publicaciones
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

// obtener una publicacion por su id
export const getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id, {
      include: [
        { model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] },
        {
          model: Comment,
          as: 'Comments',
          include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
          order: [['created_at', 'ASC']],
        },
      ],
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

// actualizar una publicacion
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

// borrar una publicacion
export const deletePublication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const publication = await Publication.findByPk(id);
    if (!publication) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }
    if (publication.UserId !== req.userId) {
      await t.rollback();
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar esta publicación.' });
    }

    // Eliminar comentarios de la publicacion atnes de eliminar la publicacion
    await Comment.destroy({ where: { PublicationId: id }, transaction: t });
    await publication.destroy({ transaction: t });
    await t.commit();

    return res.status(200).json({ success: true, message: 'Publicación y sus comentarios eliminados.' });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    console.error('Error en deletePublication:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};