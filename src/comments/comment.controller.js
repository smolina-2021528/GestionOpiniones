import { Comment } from './comment.model.js';
import { Publication } from '../publications/publication.model.js';
import { User } from '../users/user.model.js';

// crear un comentario
export const createComment = async (req, res) => {
  try {
    const { publicationId } = req.params;
    const { content } = req.body;

    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    const comment = await Comment.create({
      PublicationId: publicationId,
      UserId: req.userId,
      Content: content,
    });

    // para que al devolver el comentario muestre los datos del autor
    const full = await Comment.findByPk(comment.Id, {
      include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
    });

    return res.status(201).json({ success: true, message: 'Comentario creado.', data: full });
  } catch (error) {
    console.error('Error en createComment:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// mostrar todos los comentarios de una publicacion 
export const getCommentsByPublication = async (req, res) => {
  try {
    const { publicationId } = req.params;

    const publication = await Publication.findByPk(publicationId);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada.' });
    }

    const comments = await Comment.findAll({
      where: { PublicationId: publicationId },
      include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
      order: [['created_at', 'ASC']],
    });

    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error('Error en getCommentsByPublication:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// actualizar un comentario
export const updateComment = async (req, res) => {
  try {
    const { publicationId, commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findOne({
      where: { Id: commentId, PublicationId: publicationId },
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
    }

    if (comment.UserId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar este comentario.' });
    }

    await comment.update({ Content: content });

    const updated = await Comment.findByPk(comment.Id, {
      include: [{ model: User, as: 'Author', attributes: ['Id', 'Name', 'Surname', 'Username'] }],
    });

    return res.status(200).json({ success: true, message: 'Comentario actualizado.', data: updated });
  } catch (error) {
    console.error('Error en updateComment:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};

// borrar un comentario
export const deleteComment = async (req, res) => {
  try {
    const { publicationId, commentId } = req.params;

    const comment = await Comment.findOne({
      where: { Id: commentId, PublicationId: publicationId },
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentario no encontrado.' });
    }

    if (comment.UserId !== req.userId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este comentario.' });
    }

    await comment.destroy();
    return res.status(200).json({ success: true, message: 'Comentario eliminado.' });
  } catch (error) {
    console.error('Error en deleteComment:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
};